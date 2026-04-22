# Email OTP Login — Implementation Plan

Add a second login path: users may authenticate with **either** email+password (existing) **or** email+one-time code sent to their inbox. Same JWT output, same `AuthTokensType`, same frontend `LoginPage` surface.

---

## 1. Current State (audited)

- **API** (`apps/api/src/modules/auth/`)
  - `LoginCommand(email, password)` → `LoginHandler` bcrypt-compares, signs JWT pair (`1d`/`7d`), returns `AuthTokensType`.
  - `RefreshTokenHandler`, `GetMeHandler`, `JwtStrategy`, `AuthRepository` (findByEmail/findById) — untouched.
  - `AuthResolver` mutations: `login`, `refreshToken`; query `me`.
  - No mail service exists anywhere in the codebase.
- **Web** (`apps/web/src/features/auth/LoginPage.tsx`)
  - Single form (email + password) → `LoginMutation` → stores tokens → `MeQuery` → navigate `DASHBOARD`.
- **DB** — `User` has `password String` (required). No login-code table.

---

## 2. Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Transport | **SMTP via `nodemailer`** | Works identically local (Mailpit) and prod (Resend/SES/Mailgun SMTP). Zero vendor lock. |
| Code shape | **6-digit numeric**, 10-minute TTL | Friendly on mobile + `shadcn InputOTP` pattern. |
| Storage | New `LoginCode` model, **hashed** code (bcrypt) | Never store plaintext OTPs; same pattern as passwords. |
| Rate limit | Max 5 wrong attempts per code; max 3 codes per email per hour | Stops brute force and inbox spam. |
| Return shape | **Same `AuthTokensType`** | Frontend reuses token-storage logic verbatim. |
| UI pattern | **Two-step form on same `LoginPage`**: tabs switch between "Password" and "Email code"; code flow is Step 1 (request) → Step 2 (enter code) | Single route, no new page needed. |

---

## 3. Database Change

`packages/db/prisma/schema.prisma`:

```prisma
model LoginCode {
  id          String    @id @default(cuid())
  userId      String    @map("user_id")
  codeHash    String    @map("code_hash")
  expiresAt   DateTime  @map("expires_at")
  consumedAt  DateTime? @map("consumed_at")
  attempts    Int       @default(0)
  createdAt   DateTime  @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, consumedAt])
  @@index([expiresAt])
  @@map("login_codes")
}
```

Add back-relation on `User`: `loginCodes LoginCode[]`.

Migration: `prisma migrate dev --name add_login_codes`.

---

## 4. Backend Implementation

### 4.1 New shared mail service (`apps/api/src/common/mail/`)

- `IMailService` (abstract) with `sendLoginCode(to: string, code: string, userName: string)`.
- `NodemailerMailService` (concrete) — reads SMTP env, renders a tiny HTML + text template (Spanish-first).
- Register as a **global module** `MailModule` so any feature can inject it.
- Provider wiring: `{ provide: IMailService, useClass: NodemailerMailService }`.

### 4.2 New repository methods on `IAuthRepository`

```ts
createLoginCode: RepositoryMethod<[data: ICreateLoginCodeData], ILoginCode>
findActiveLoginCode: RepositoryMethod<[userId: string], ILoginCode | null>
countRecentCodes: RepositoryMethod<[userId: string, sinceMinutes: number], number>
consumeLoginCode: RepositoryMethod<[id: string], void>
incrementAttempts: RepositoryMethod<[id: string], number>
```

All already-structurally-required `tx: TxClient` — no opt-out.

### 4.3 Two new commands (vertical slices)

```
commands/
├── request-login-code/
│   ├── request-login-code.command.ts   (email)
│   └── request-login-code.handler.ts
└── login-with-code/
    ├── login-with-code.command.ts      (email, code)
    └── login-with-code.handler.ts
```

**`RequestLoginCodeHandler.handle`:**
1. Find user by email (return `{ ok: true }` even if missing — no user enumeration).
2. If found: `countRecentCodes(user.id, 60) >= 3` → throw `TooManyRequestsException` (`ErrorCode.RATE_LIMITED`).
3. Generate `code = crypto.randomInt(100000, 999999).toString()`.
4. `codeHash = bcrypt.hash(code, 10)`, `expiresAt = now + 10min`.
5. `createLoginCode({ userId, codeHash, expiresAt })`.
6. Queue a domain event `LoginCodeRequestedEvent(userId, email, code, name)` — emitted after commit.
7. Subscribe an event handler that calls `mailService.sendLoginCode(...)`. (Keeps the tx lean, matches existing `IEventEmitter` pattern.)

**`LoginWithCodeHandler.handle`:**
1. Find user by email → if missing, throw `InvalidCredentialsException`.
2. `findActiveLoginCode(user.id)` (unconsumed, not expired) → if missing, same error.
3. If `attempts >= 5` → same error.
4. `bcrypt.compare(code, record.codeHash)` → if false, `incrementAttempts`, throw.
5. `consumeLoginCode(record.id)`.
6. Sign JWT pair (identical to `LoginHandler`).

### 4.4 Resolver additions

```ts
@Mutation(() => Boolean)
async requestLoginCode(@Args('input') input: RequestLoginCodeInput): Promise<boolean>

@Mutation(() => AuthTokensType)
async loginWithCode(@Args('input') input: LoginWithCodeInput): Promise<IAuthTokens>
```

Inputs (`@InputType` + `class-validator`):
- `RequestLoginCodeInput { @IsEmail email: string }`
- `LoginWithCodeInput { @IsEmail email: string; @Length(6,6) @Matches(/^\d{6}$/) code: string }`

### 4.5 Module wiring (`auth.module.ts`)

Add to `providers`: `RequestLoginCodeHandler`, `LoginWithCodeHandler`, `LoginCodeRequestedEventHandler`.
`imports`: `MailModule` (or make it `@Global()`).

---

## 5. Frontend Implementation

`apps/web/src/features/auth/LoginPage.tsx` — rework into **tabbed** auth with shadcn:

- `pnpm dlx shadcn@latest add tabs input-otp`
- Tabs: **Contraseña** (current form, unchanged) | **Código por correo** (new two-step form).
- Code tab state machine: `idle → codeSent → verifying`.
  - Step 1: email input + "Enviar código" button → `RequestLoginCodeMutation`.
  - Step 2: `<InputOTP maxLength={6}>` + "Verificar" → `LoginWithCodeMutation` → same `onCompleted` block that already exists (store tokens, fetch `me`, navigate).
- Reuse `useAuth`, `ROUTES`, error handling, `useTranslation('auth')`.
- i18n keys (add to `apps/web/public/locales/es/auth.json` + `en/auth.json`):
  - `auth.tabs.password`, `auth.tabs.code`, `auth.sendCode`, `auth.codeSent`, `auth.codeHint`, `auth.verifyCode`, `auth.codeExpired`, `auth.resendCode`.

After schema/operations land: `pnpm --filter @ceicavs/web generate` regenerates `LoginWithCodeDocument`, `RequestLoginCodeDocument`.

---

## 6. Local Setup (Mailpit)

Mailpit = zero-config SMTP sink with a web UI to inspect every sent mail. Perfect dev loop.

### 6.1 `docker-compose.yml` — add service

```yaml
  mailpit:
    image: axllent/mailpit:latest
    ports:
      - '1025:1025'   # SMTP
      - '8025:8025'   # Web UI — http://localhost:8025
    restart: unless-stopped
```

### 6.2 `apps/api/.env` (and `.env.example`)

```
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM="CEICAVS <no-reply@ceicavs.local>"
OTP_CODE_TTL_MINUTES=10
OTP_MAX_CODES_PER_HOUR=3
OTP_MAX_ATTEMPTS=5
```

### 6.3 Local commands

```bash
docker compose up -d                          # starts postgres + mailpit
pnpm install
pnpm --filter @ceicavs/db prisma migrate dev  # applies add_login_codes
pnpm --filter @ceicavs/api dev                # regenerates schema.gql
pnpm --filter @ceicavs/web generate           # typed ops
pnpm dev                                      # all workspaces
```

Manual test: open `/login` → Code tab → enter your user's email → check `http://localhost:8025` → copy the 6-digit code → paste into OTP input → lands on dashboard.

---

## 7. Production Setup

Pick **one** SMTP provider — all three work with the same `nodemailer` config:

| Provider | `SMTP_HOST` | `SMTP_PORT` | Notes |
|---|---|---|---|
| **Resend** (recommended, simplest) | `smtp.resend.com` | `465` (secure) | `SMTP_USER=resend`, `SMTP_PASS=<API key>`. Verify sender domain via DNS (SPF + DKIM). |
| **AWS SES** | `email-smtp.<region>.amazonaws.com` | `587` | Create SMTP credentials in SES console; move out of sandbox for real recipients. |
| **Mailgun** | `smtp.mailgun.org` | `587` | Add domain, SPF + DKIM DNS records. |

### 7.1 Production env

```
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=resend
SMTP_PASS=<api-key>           # store as secret, never commit
MAIL_FROM="CEICAVS <no-reply@ceicavs.sv>"
OTP_CODE_TTL_MINUTES=10
OTP_MAX_CODES_PER_HOUR=3
OTP_MAX_ATTEMPTS=5
```

### 7.2 DNS (once per domain)

- SPF: `v=spf1 include:<provider-spf> ~all`
- DKIM: CNAMEs provided by Resend/SES/Mailgun.
- DMARC: `v=DMARC1; p=quarantine; rua=mailto:postmaster@ceicavs.sv`.

### 7.3 Deploy sequence

1. Add SMTP secrets in host (Vercel/Fly/Railway/EC2 env vars).
2. Run `prisma migrate deploy` against prod DB (adds `login_codes`).
3. Deploy API, then web.
4. Smoke test with one real user: request code, verify receipt, login.
5. Monitor the mail provider's dashboard for bounces / deliverability the first 24h.

---

## 8. Security Checklist

- [x] Codes hashed at rest (bcrypt cost 10).
- [x] No user enumeration — `requestLoginCode` always returns `true`.
- [x] Per-code attempt lock (5), per-email code-issuance limit (3/h).
- [x] 10-minute TTL, single-use (`consumedAt`).
- [x] Same `InvalidCredentialsException` error for every failure branch (missing user, wrong code, expired, locked).
- [x] Generate with `crypto.randomInt`, not `Math.random`.
- [x] HTML mail template stores no PII beyond first name + code.

---

## 9. Rollout Order

1. DB migration (`add_login_codes`).
2. `MailModule` + SMTP plumbing + Mailpit in `docker-compose`.
3. Backend commands + resolver mutations + unit tests (testing agent).
4. `pnpm --filter @ceicavs/api dev` → schema regenerates.
5. Web tabs + OTP input + codegen.
6. i18n strings (ES primary, EN secondary).
7. Local E2E: request → receive → login.
8. Provision SMTP provider + DNS in prod → deploy.

---

## 10. Out of Scope (follow-ups)

- SMS codes / WhatsApp codes.
- WebAuthn / passkeys.
- Device-trust ("remember this browser for 30 days").
- Login-attempt audit log (separate Activity feature).
