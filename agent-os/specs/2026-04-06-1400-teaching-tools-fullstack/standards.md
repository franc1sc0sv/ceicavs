# Standards for Teaching Tools Fullstack

The following standards apply to this work.

---

## backend/cqrs-patterns

- Transaction-first execution: all handlers wrap in `$transaction`
- Event collection during `handle()`, emission after commit via `IEventEmitter`
- TX contract: all repository methods require `tx: TxClient` via `RepositoryMethod` type
- CASL authorization inside every handler — guard = coarse gate, handler = fine-grained
- Thin resolvers: dispatch to `CommandBus`/`QueryBus`, zero business logic

---

## database/prisma-kysely-patterns

- PrismaPg adapter with connection string directly (no Pool)
- Kysely DummyDriver for query building only
- TxClient type enforced at compile time
- All columns snake_case via `@map()`/`@@map()`
- Soft delete: `deletedAt DateTime?` — filter with `where: { deletedAt: null }`

---

## frontend/architecture-patterns

- Feature-first folder structure: `features/tools/` with components, hooks, graphql, pages, implementations
- Apollo Client for GraphQL data; React context for local state
- Four-state rendering: loading -> error -> empty -> content
- CASL `<Can>` components for conditional rendering
- Named exports (no default exports except for lazy-loaded pages)

---

## frontend/design-system

- shadcn/ui component library — use MCP server for component discovery and usage
- Tailwind v4 utilities for layout, spacing, responsive breakpoints
- Dark mode via `dark:` variant classes
- Responsive grid: 4 columns desktop (lg), 2 tablet (sm), 1 mobile
- Color system: tool accent colors (14 variants) for icon backgrounds and hover borders
