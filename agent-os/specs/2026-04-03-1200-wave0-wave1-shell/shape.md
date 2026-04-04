# Wave 0 + Wave 1 Shell — Shaping Notes

## Scope

Bootstrap the CEICAVS platform from scaffolded infrastructure to a working authenticated shell. After this, all 6 feature sections can be built independently.

## Decisions

- Wave 1a and 1b run in parallel — file ownership is strictly disjoint
- `app.module.ts` owned only by shell-backend; all route declarations owned only by shell-frontend
- Stub domain modules (DashboardModule etc.) registered in app.module.ts as empty NestJS modules — filled in Wave 2
- Stub pages are bare `<h1>Section</h1>` components — filled in Wave 2
- Spanish is the default i18n locale; all UI strings via `t()`, zero hardcoded Spanish text
- Dark mode via Tailwind v4 `class` strategy

## Context

- **Visuals:** None — building from design-system standards
- **References:** `apps/api/src/common/` (CQRS base), `apps/web/src/context/ability.context.tsx` (AbilityProvider)
- **Product alignment:** Shell is Milestone 01 — hard dependency for all other milestones per roadmap

## Standards Applied

- `backend/cqrs-patterns` — transaction-first handlers, thin resolvers, CASL in handlers
- `database/prisma-kysely-patterns` — TxClient, PrismaPg adapter
- `frontend/architecture-patterns` — feature-first folders, Apollo vs Context split, CASL components
- `frontend/design-system` — Tailwind v4 tokens, dark mode, responsive sidebar
