# CEICAVS — Wave 0 + Wave 1 (Shell) Implementation Plan

## Execution Order

```
[Wave 0]  feat/00-database        (database agent)    ✅ COMPLETE
              ↓
[Wave 1]  feat/01a-shell-backend  (backend agent)   ← parallel
          feat/01b-shell-frontend (frontend agent)  ← parallel
```

## Wave 0 — Database Migration ✅

- Ran `prisma migrate dev --name init`
- Migration created: `packages/db/prisma/migrations/20260403225413_init/migration.sql`
- `pnpm -r typecheck` passes on all 5 packages

## Wave 1a — Shell Backend

Branch: `feat/01a-shell-backend`  
Scope: `apps/api/src/modules/auth/` + `apps/api/src/app.module.ts`

- Auth module: LoginCommand, RefreshTokenCommand, GetMeQuery
- JWT strategy (Passport)
- Thin auth resolver
- Stub 6 domain modules registered in app.module.ts

## Wave 1b — Shell Frontend

Branch: `feat/01b-shell-frontend`  
Scope: `apps/web/src/` (except `context/ability.context.tsx`)

- AppShell layout + MainNav sidebar + UserMenu
- React Router v7 with all 7 routes declared
- Apollo Client with JWT auth link
- i18n (ES default, EN fallback)
- Dark/light mode
- LoginPage
- Stub pages for all 6 sections
