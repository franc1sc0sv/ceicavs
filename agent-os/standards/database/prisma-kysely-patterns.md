# Prisma + Kysely Patterns

## 1. Prisma 7 + PrismaPg Adapter

```typescript
import { PrismaClient } from './generated/client/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg(process.env.DATABASE_URL!)
export const prisma = new PrismaClient({ adapter })
```

- Pass connection string directly to `PrismaPg` — never use `Pool`.
- Import `PrismaClient` from `./generated/client/client` — never from `@prisma/client`.
- Use `prisma-client` generator with `output` — not `prisma-client-js`.

## 2. Kysely DummyDriver (Query Building Only)

```typescript
import { DummyDriver, Kysely, PostgresAdapter,
  PostgresIntrospector, PostgresQueryCompiler } from 'kysely'
import type { DB } from './types'

export const kysely = new Kysely<DB>({
  dialect: {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db) => new PostgresIntrospector(db),
    createQueryCompiler: () => new PostgresQueryCompiler(),
  },
})
```

- **Why:** Type-safe SQL building for complex queries (aggregations, joins, CTEs) that Prisma can't express. Prisma handles connection/transaction, Kysely handles query construction.
- Execute via `tx.$queryRawUnsafe(compiledQuery.sql, ...compiledQuery.parameters)`.
- Kysely never connects to the database directly.

## 3. TxClient Type Extraction

```typescript
export type TxClient = Parameters<
  Extract<Parameters<PrismaClient['$transaction']>[0],
  (...args: any[]) => any>
>[0]
```

- Single source of truth for the transaction client type.
- Exported from `@ceicavs/db` and used by all repositories.

## 4. Snake_case Column Mapping

All database columns use snake_case, mapped via Prisma decorators:

```prisma
model User {
  id        String   @id @default(uuid())
  firstName String   @map("first_name")
  createdAt DateTime @default(now()) @map("created_at")
  @@map("users")
}
```

- TypeScript uses camelCase, database uses snake_case.
- Every model has `@@map("table_name")` (plural, snake_case).
- Every field has `@map("column_name")` where it differs from the field name.

## 5. Soft Delete Convention

```prisma
model Post {
  deletedAt DateTime? @map("deleted_at")
}
```

Entities with soft delete: User, Group, Post, Category, Comment, ToolCategory, Tool, Folder, Recording.

- **Manual filtering required:** Every query must add `where: { deletedAt: null }`. No middleware/scope.
- To "delete": `update({ where: { id }, data: { deletedAt: new Date() } })`.
- To restore: `update({ where: { id }, data: { deletedAt: null } })`.
