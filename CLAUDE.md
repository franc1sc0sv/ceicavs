# CEICAVS

School management platform for Centro Escolar CEICAVS. Turbo + pnpm monorepo with React frontend, NestJS GraphQL API, and Prisma 7 + Kysely database layer. Spanish-first UI, English codebase.

## Workspaces

| Workspace | Purpose | Entry | Key Dependencies |
|---|---|---|---|
| `apps/web` | React SPA | `src/main.tsx` | React 19, Vite, Tailwind v4, shadcn/ui, React Router v7 |
| `apps/api` | NestJS GraphQL API | `src/main.ts` | NestJS 10, Apollo, @nestjs/cqrs, Passport JWT |
| `packages/shared` | Shared types + CASL | `src/index.ts` | @casl/ability |
| `packages/db` | Prisma + Kysely | `src/index.ts` | Prisma 7, @prisma/adapter-pg, Kysely |

## Architecture Rules

### CQRS (non-negotiable)

- Every write operation: `@CommandHandler` extending `BaseCommandHandler` in `common/cqrs/`
- Every read operation: `@QueryHandler` extending `BaseQueryHandler` in `common/cqrs/`
- No service classes — one handler per operation
- Resolvers are thin: dispatch to `CommandBus`/`QueryBus`, zero business logic

### Transactions

- **Always transactional** — both commands AND queries wrap in `$transaction`
- Repositories require `tx: TxClient` — enforced at compile time via `RepositoryMethod` type
- Use `RepositoryMethod<[...args], TReturn>` in abstract repo classes — makes `tx` structurally required
- All repository interfaces must implement `IBaseRepository<TEntity>` from `common/cqrs/`
- `IDatabaseService` only exposes `$transaction()` — no `get client()`

### Inversion of Control

- All dependencies via abstract classes as NestJS DI tokens
- Handlers never import concrete classes
- Module wires: `{ provide: IXRepository, useClass: XRepository }`
- Global abstractions: `IDatabaseService`, `IEventEmitter`
- Per-module abstractions: `IPostRepository`, `IUserRepository`, etc.

### Vertical Slice Structure

```
modules/[domain]/
├── [domain].module.ts
├── interfaces/          ← abstract repos + domain interfaces
├── repositories/        ← concrete Prisma implementations
├── resolvers/           ← thin GraphQL resolvers
├── commands/[action]-[resource]/
├── queries/[action]-[resource]/
├── events/              ← event interfaces + classes
└── types/               ← @ObjectType GraphQL output shapes
```

### Validation

- `class-validator` decorators on `@InputType()` classes
- `ValidationPipe` enabled globally with `whitelist`, `forbidNonWhitelisted`, `transform`
- No Zod anywhere

### Authorization

- `defineAbilityFor(role)` from `@ceicavs/shared` — single source of truth
- CASL check inside every handler, not just in guards
- Guards handle authentication (is user logged in?), handlers handle authorization (can user do this?)

### Domain Events

- All events implement `IDomainEvent` (requires `eventName` + `occurredAt`)
- Event interfaces in `events/[domain].events.ts`, classes in `events/[action]-[entity].event.ts`
- Collected during `handle()`, emitted after transaction commits via `IEventEmitter`

### Types

- All domain types in dedicated `interfaces/` files — no inline declarations
- Interfaces use `I` prefix: `IPost`, `ICreatePostData`, `IPostFilters`
- Event interfaces extend `IDomainEvent`
- GraphQL types (`@ObjectType`, `@InputType`) are classes in `types/` and `commands/`

## Database

- **Prisma 7**: generator `prisma-client` with `output = "../src/generated/client"`
- **Config**: `prisma.config.ts` — no `env()` helper, use `process.env`
- **Client**: `src/prisma-client.ts` imports from `./generated/client/client`
- **Adapter**: `PrismaPg(process.env.DATABASE_URL!)` — connection string directly, no Pool
- **Kysely**: DummyDriver pattern — query building only, execute via `tx.$queryRawUnsafe()`
- **Types**: auto-generated as `DB` in `src/types.ts` via `prisma-kysely`
- **Schema**: all columns snake_case via `@map()`/`@@map()`
- **Soft delete**: `deletedAt DateTime?` on User, Group, Post, Category, Comment, ToolCategory, Tool, Folder, Recording
- **After schema changes**: run `prisma generate` then `prisma migrate dev --name descriptive_name`

## Agents

| Agent | Scope | When to use |
|---|---|---|
| `backend` | NestJS modules, handlers, resolvers, repos | Creating/modifying API features |
| `frontend` | React components, pages, hooks, styling | Creating/modifying UI features |
| `database` | Prisma schema, migrations, seeds, Kysely | Schema changes, query optimization |
| `testing` | Vitest tests across all packages | Writing or running tests |
| `review` | Code review, PR creation, type audits | Before merging, quality checks |

## Skills

### Backend
- `nestjs-architecture` — CQRS, vertical slices, IoC, transactional handlers
- `platform-backend` — API design, error handling, validation, logging
- `prisma-client-api` — Prisma CRUD operations, filters, transactions
- `prisma-cli` — Prisma CLI commands reference
- `prisma-database-setup` — Database provider configuration
- `prisma-driver-adapter-implementation` — Driver adapter contracts
- `prisma-postgres` — Prisma Postgres managed database
- `apollo-skills:apollo-server` — Apollo Server config, plugins, context setup
- `apollo-skills:graphql-schema` — GraphQL schema design best practices

### Frontend
- `tech-react` — React components, hooks, rendering patterns
- `platform-frontend` — State management, data fetching
- `design-frontend` — Layout, responsive, Tailwind tokens
- `design-accessibility` — WCAG AA, ARIA, keyboard navigation
- `apollo-skills:apollo-client` — Apollo Client 4.x hooks, caching, auth links
- `apollo-skills:graphql-operations` — Query, mutation, fragment best practices

### Cross-cutting
- `lang-typescript` — TypeScript patterns, strict mode, no any
- `core-coding-standards` — KISS, DRY, clean code
- `platform-database` — SQL design, query optimization
- `platform-testing` — Test philosophy, structure, mocking
- `tech-vitest` — Vitest utilities, vi.mock, fake timers

### Tooling
- `agent-pr-creator` — PR creation via gh CLI
- `type-system-audit` — Type safety audit from bug-fix commits
- `promptify` — Prompt engineering and improvement

## Commands

```bash
# Development
pnpm dev                          # Start all workspaces
pnpm --filter @ceicavs/api dev    # Start API only
pnpm --filter @ceicavs/web dev    # Start web only

# Type checking
pnpm -r typecheck                 # All packages
pnpm --filter @ceicavs/api typecheck

# Database
prisma generate                   # Regenerate client + Kysely types
prisma migrate dev --name <name>  # Create + apply migration
prisma migrate deploy             # Apply pending migrations (prod)
prisma studio                     # Database GUI
docker compose up -d              # Start PostgreSQL

# Build
pnpm -r build                    # Build all packages
```

## Code Quality (non-negotiable)

- **No `any`** — every value must have an explicit, precise type; never use `any` or cast with `as any`
- **No type bypasses** — no `@ts-ignore`, `@ts-expect-error`, or unsafe casts (`as unknown as X`)
- **No comments** — code must be self-documenting through naming and structure; no inline comments, no block comments, no JSDoc
- **Strict typing everywhere** — function parameters, return types, generics, and object shapes must all be explicitly typed
- **KISS & DRY** — no speculative abstractions, no duplicate logic, no dead code

## Do NOT

- Use Zod — use `class-validator` on `@InputType()`
- Create service classes — use command/query handlers
- Use `@Inject()` string tokens — import directly or use abstract class DI tokens
- Make `tx` optional in repositories — always required
- Declare types inline — use dedicated interface files
- Use `prisma-client-js` generator — use `prisma-client` with `output`
- Use `env()` in `prisma.config.ts` — use `process.env` (it throws when var is missing)
- Import `PrismaClient` from `@prisma/client` — import from `./generated/client/client`
- Use `Pool` with `PrismaPg` — pass connection string directly
- Skip CASL checks in handlers — authorization is mandatory inside every handler
- Put business logic in resolvers — resolvers only dispatch to buses
- Use `any` type — define a proper interface or generic instead
- Add comments — rename or restructure the code to make it clear without them
