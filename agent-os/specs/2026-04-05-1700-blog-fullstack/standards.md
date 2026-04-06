# Standards for Blog Fullstack

The following standards apply to this work.

---

## backend/cqrs-patterns

### 1. Transaction-First Execution

Both commands AND queries run inside `$transaction`.

```typescript
// BaseCommandHandler.execute()
const result = await this.db.$transaction((tx) =>
  this.handle(command, tx, events),
)

// BaseQueryHandler.execute()
return this.db.$transaction((tx) => this.handle(query, tx))
```

- Never call a repository method outside a transaction.

### 2. Event Collection After Commit

Domain events collected during `handle()`, emitted AFTER transaction commits.

```typescript
protected abstract handle(
  command: TCommand,
  tx: TxClient,
  events: IDomainEvent[],
): Promise<TResult>

// In execute():
for (const event of events) {
  this.eventEmitter.emit(event.eventName, event)
}
```

- Push events inside `handle()`, never call `eventEmitter.emit()` directly in a handler.

### 3. Repository TxClient Contract

`tx: TxClient` is always **required** — never optional, no fallbacks.

```typescript
export abstract class IPostRepository {
  abstract findById: RepositoryMethod<[id: string], Post | null>
  abstract create: RepositoryMethod<[data: ICreatePostData], Post>
}
```

- `RepositoryMethod` type makes `tx` structurally required at compile time.

### 4. CASL Authorization Inside Handlers

Every handler checks CASL inside `handle()`. No exceptions.

```typescript
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'

protected async handle(command: CreatePostCommand, tx: TxClient, events: IDomainEvent[]) {
  const ability = defineAbilityFor(command.user.role)
  if (!ability.can(Action.CREATE, Subject.POST)) {
    throw new ForbiddenException()
  }
}
```

### 5. Thin Resolvers

Resolvers dispatch to `CommandBus`/`QueryBus`. Zero business logic.

```typescript
@Mutation(() => PostType)
async createPost(@Args('input') input: CreatePostInput, @CurrentUser() user: AuthUser) {
  return this.commandBus.execute(new CreatePostCommand(input, user))
}
```

---

## database/prisma-kysely-patterns

### 1. Prisma 7 + PrismaPg Adapter

```typescript
import { PrismaClient } from './generated/client/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg(process.env.DATABASE_URL!)
export const prisma = new PrismaClient({ adapter })
```

- Pass connection string directly — never use `Pool`.
- Import `PrismaClient` from `./generated/client/client` — never from `@prisma/client`.

### 2. Kysely DummyDriver (Query Building Only)

```typescript
export const kysely = new Kysely<DB>({
  dialect: {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db) => new PostgresIntrospector(db),
    createQueryCompiler: () => new PostgresQueryCompiler(),
  },
})
```

- Execute via `tx.$queryRawUnsafe(compiledQuery.sql, ...compiledQuery.parameters)`.
- Kysely never connects to the database directly.

### 3. TxClient Type Extraction

```typescript
export type TxClient = Parameters<
  Extract<Parameters<PrismaClient['$transaction']>[0], (...args: any[]) => any>
>[0]
```

### 4. Snake_case Column Mapping

All database columns snake_case via `@map()` / `@@map()`. TypeScript uses camelCase.

### 5. Soft Delete Convention

Entities with soft delete: User, Group, Post, Category, Comment.

- Every query must add `where: { deletedAt: null }` — no middleware/scope.
- To "delete": `update({ where: { id }, data: { deletedAt: new Date() } })`.

---

## frontend/architecture-patterns

### 1. Feature-First Folders

```
features/blog/
  pages/       # Route-level components (lazy-loaded)
  components/  # Feature-local UI
  hooks/       # Feature-local data/logic hooks
  graphql/     # Co-located queries + mutations
```

- No barrel files. Import directly from the defining file.

### 2. Apollo vs Context State Split

- Server data (GraphQL) → Apollo Client (`useQuery`, `useMutation`)
- UI state → React Context
- Form fields, modal open/close → local `useState`

### 3. Four-State Rendering (Mandatory)

```typescript
if (loading) return <PageLoader />
if (error) return <ErrorState error={error} onRetry={() => refetch()} />
if (!data?.items?.length) return <EmptyState />
return <ItemList items={data.items} />
```

Order: loading → error → empty → success. Always.

### 4. CASL Permission Patterns

```typescript
import { Action, Subject } from '@ceicavs/shared'

const ability = useAbility()
if (!ability.can(Action.CREATE, Subject.POST)) return null

<Can I={Action.DELETE} a={Subject.POST}><DeleteButton /></Can>
```

- Never hardcode role strings or CASL strings. Always use enum values from `@ceicavs/shared`.

### 5. i18n — Strict `useTranslation()` (no hardcoded strings)

Every user-facing string must come from i18n. Never hardcode Spanish (or English) text in components.

```typescript
const { t } = useTranslation('blog')

<Button>{t('actions.publish')}</Button>
<Badge>{t('status.draft')}</Badge>
```

- Namespace per feature: `'blog'`
- Shared strings (nav, roles, auth): `'common'` namespace
- Both `es/` and `en/` JSON files must have matching keys
- Interpolation: `t('comments.count', { count })` etc.

### 6. Named Exports Everywhere

```typescript
export function BlogPage() { ... }
export function usePostFeed() { ... }
```

---

## frontend/design-system

### Color System

- Primary: `indigo-600` (light) / `indigo-400` (dark) — buttons, active nav, links
- Secondary: `amber-*` — warnings, highlights
- Neutral: `slate-*` — backgrounds, text, borders

Role badge colors: Admin=`indigo`, Teacher=`amber`, Student=`emerald`

### Dark Mode

All components use `dark:` variants:

```tsx
<div className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
  <p className="text-slate-900 dark:text-slate-100">...</p>
</div>
```

Every component must have both light and dark variants.

### Typography

- **Inter** (400, 500, 600, 700): headings, body, UI labels
- **JetBrains Mono** (400, 500): code blocks
