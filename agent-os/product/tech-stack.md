# Tech Stack

## Frontend

- **React 19** — SPA with Vite 6
- **Tailwind CSS v4** — CSS-first config via `@theme`, `@tailwindcss/vite` plugin
- **React Router v7** — Client-side routing with lazy-loaded pages
- **Apollo Client** — GraphQL data fetching and cache
- **CASL/React** — Role-based UI visibility (`<Can>`, `useAbility()`)
- **Framer Motion** — Page transitions, staggered lists, micro-interactions
- **react-i18next** — Internationalization (Spanish default, English fallback)
- **Radix UI** — Headless accessible primitives (via shadcn/ui)

## Backend

- **NestJS 10** — GraphQL API (Apollo Server 4, code-first schema)
- **@nestjs/cqrs** — Command/query separation with transactional handlers
- **@nestjs/event-emitter** — Domain events emitted after transaction commit
- **Passport JWT** — Authentication
- **CASL** — Authorization checked inside every handler
- **class-validator** — Input validation on `@InputType()` classes

## Database

- **PostgreSQL** — Primary database (Docker Compose for local dev)
- **Prisma 7** — ORM with `@prisma/adapter-pg` (PrismaPg, connection string)
- **Kysely** — Type-safe SQL query builder (DummyDriver, build-only)
- **prisma-kysely** — Auto-generates Kysely types from Prisma schema

## Infrastructure

- **Turbo 2** — Monorepo task orchestration
- **pnpm** — Package manager with workspaces
- **TypeScript 5** — Strict mode across all packages
- **Docker Compose** — Local PostgreSQL
