# CEICAVS - Project Setup Guide

School management platform for Centro Escolar CEICAVS. Turbo + pnpm monorepo.

## Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 20+ |
| pnpm | 10+ |
| Docker | 24+ |
| Docker Compose | 2+ |

## Monorepo Structure

```
ceicavs/
├── apps/
│   ├── api/          # NestJS GraphQL API (port 3001)
│   └── web/          # React SPA with Vite (port 5173)
├── packages/
│   ├── db/           # Prisma 7 + Kysely
│   ├── shared/       # Shared types + CASL
│   └── ui/           # Shared UI components
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Initial Setup

### 1. Clone the repository

```bash
git clone <repo-url> ceicavs
cd ceicavs
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment variables

Copy the example file and adjust if needed:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description | Default (dev) |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://ceicavs:ceicavs@localhost:5432/ceicavs` |
| `JWT_SECRET` | Secret for JWT tokens | `dev-secret-change-in-production` |
| `VITE_API_URL` | API URL for the frontend | `http://localhost:3001/graphql` |

### 4. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL 17 on port 5432 with the credentials from `.env`.

To verify it's running:

```bash
docker compose ps
```

### 5. Generate Prisma client and run migrations

```bash
pnpm db:generate
pnpm db:migrate
```

### 6. Seed initial data

```bash
pnpm db:seed
```

This creates 3 test users:

| Email | Password | Role |
|---|---|---|
| `admin@ceicavs.edu` | `Admin123!` | admin |
| `teacher@ceicavs.edu` | `Teacher123!` | teacher |
| `student@ceicavs.edu` | `Student123!` | student |

### 7. Start the development environment

```bash
pnpm dev
```

This starts both applications in parallel via Turborepo:

- **API**: http://localhost:3001/graphql (GraphQL Playground)
- **Web**: http://localhost:5173

## Available Commands

### Development

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode |
| `pnpm --filter @ceicavs/api dev` | Start only the API |
| `pnpm --filter @ceicavs/web dev` | Start only the frontend |

### Code Quality

| Command | Description |
|---|---|
| `pnpm typecheck` | Type checking across all packages |
| `pnpm lint` | Lint across all packages |
| `pnpm build` | Production build |

### Database

| Command | Description |
|---|---|
| `pnpm db:generate` | Regenerate Prisma client + Kysely types |
| `pnpm db:migrate` | Create and apply pending migrations |
| `pnpm db:seed` | Seed initial data |
| `docker compose up -d` | Start PostgreSQL |
| `docker compose down` | Stop PostgreSQL |

### Frontend

| Command | Description |
|---|---|
| `pnpm --filter @ceicavs/web generate` | Generate GraphQL types from the API schema |

## Tech Stack

### Backend (`apps/api`)

- **NestJS 10** with CQRS architecture (Command/Query Responsibility Segregation)
- **GraphQL** code-first with Apollo Server + `@nestjs/graphql`
- **Passport JWT** for authentication
- **CASL** for role-based authorization
- **SWC** compiler (with `tsx` as runtime for workspace packages)

### Frontend (`apps/web`)

- **React 19** with **Vite**
- **React Router v7** in data mode (`createBrowserRouter`)
- **Apollo Client 4** for GraphQL queries
- **Tailwind CSS v4** for styling
- **i18next** for internationalization (Spanish by default)
- **CASL** + `@casl/react` for permission-based rendering

### Database (`packages/db`)

- **Prisma 7** with PostgreSQL adapter (`@prisma/adapter-pg`)
- **Kysely** for complex queries (query building only, execution via Prisma)

### Shared (`packages/shared`)

- **CASL** ability factory (`defineAbilityFor(role)`)
- Shared types between frontend and backend

## API Architecture

The backend follows the CQRS pattern with Vertical Slices:

```
modules/[domain]/
├── [domain].module.ts           # IoC wiring
├── interfaces/                  # Abstract repositories + types
├── repositories/                # Concrete implementations (Prisma)
├── resolvers/                   # GraphQL resolvers (thin)
├── commands/[action]-[resource]/# Write handlers
├── queries/[action]-[resource]/ # Read handlers
├── events/                      # Domain events
└── types/                       # @ObjectType / @InputType GraphQL
```

Key rules:
- Resolvers only dispatch to `CommandBus` / `QueryBus`
- Every operation runs inside a transaction
- CASL authorization check is mandatory inside every handler
- Dependencies via abstract classes (IoC)

## Frontend Architecture

Feature-first organization:

```
src/features/[feature]/
├── components/    # Feature-specific components
├── hooks/         # Feature-specific hooks
├── graphql/       # Co-located GraphQL operations
├── pages/         # Route-level components
└── index.ts       # Named exports
```

## Authentication Flow

1. User enters email and password at `/login`
2. The `login` mutation returns `accessToken` + `refreshToken`
3. Tokens are stored in `localStorage`
4. Apollo Client sends the `accessToken` in the `Authorization: Bearer <token>` header
5. `AppBootstrap` hydrates the auth context on page reload
6. `AbilityProvider` configures CASL permissions based on the user's role
7. Navigation is filtered by permissions via the `Can` component

## Troubleshooting

### API doesn't start / hangs

Verify Docker is running and the database is reachable:

```bash
docker compose ps
docker compose logs db
```

### "Cannot find module" error when starting the API

Regenerate the Prisma client:

```bash
pnpm db:generate
```

### Frontend types don't match the API

Regenerate GraphQL types:

```bash
pnpm --filter @ceicavs/web generate
```

Note: the API must be running or the `apps/api/src/schema.gql` file must exist.

### Port 3001 or 5173 already in use

```bash
lsof -i :3001
lsof -i :5173
```
