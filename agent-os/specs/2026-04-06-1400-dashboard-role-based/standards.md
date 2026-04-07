# Standards for Dashboard Role-Based Redesign

The following standards apply to this work.

---

## backend/cqrs-patterns

### 1. Transaction-First Execution

Both commands AND queries run inside `$transaction`.

```typescript
// BaseCommandHandler.execute()
const result = await this.db.$transaction((tx) =>
  this.handle(command, tx, events),
);

// BaseQueryHandler.execute()
return this.db.$transaction((tx) => this.handle(query, tx));
```

- Never call a repository method outside a transaction.

### 2. Event Collection After Commit

Domain events are collected during `handle()`, emitted AFTER the transaction commits.

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

`tx: TxClient` is always **required** in repository methods — never optional.

```typescript
export abstract class IPostRepository {
  abstract findById: RepositoryMethod<[id: string], Post | null>
  abstract create: RepositoryMethod<[data: ICreatePostData], Post>
}
```

- `RepositoryMethod` type makes `tx` structurally required at compile time.
- All repository interfaces implement `IBaseRepository<TEntity>`.

### 4. CASL Authorization Inside Handlers

Every handler checks CASL inside `handle()`. No exceptions.

```typescript
protected async handle(command: CreatePostCommand, tx: TxClient, events: IDomainEvent[]) {
  const ability = defineAbilityFor(command.user.role)
  if (!ability.can('create', 'Post')) {
    throw new ForbiddenException()
  }
}
```

- Guards handle authentication. Handlers handle authorization.

### 5. Thin Resolvers

Resolvers dispatch to `CommandBus`/`QueryBus`. Zero business logic.

```typescript
@Mutation(() => PostType)
async createPost(
  @Args('input') input: CreatePostInput,
  @CurrentUser() user: AuthUser,
) {
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

- Pass connection string directly to `PrismaPg` — never use `Pool`.
- Import `PrismaClient` from `./generated/client/client` — never from `@prisma/client`.

### 2. Kysely DummyDriver (Query Building Only)

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

- Type-safe SQL building for complex queries (aggregations, joins, CTEs).
- Execute via `tx.$queryRawUnsafe(compiledQuery.sql, ...compiledQuery.parameters)`.
- Kysely never connects to the database directly.

### 3. Snake_case Column Mapping

All database columns use snake_case, mapped via Prisma `@map()`/`@@map()`.

### 4. Soft Delete Convention

Entities with soft delete: User, Group, Post, Category, Comment, ToolCategory, Tool, Folder, Recording.

- Manual filtering required: every query must add `where: { deletedAt: null }`.
- To "delete": `update({ data: { deletedAt: new Date() } })`.

---

## frontend/architecture-patterns

### 1. Feature-First Folders

```
features/[section]/
  pages/          # Route-level components (lazy-loaded)
  components/     # Feature-local UI
  hooks/          # Feature-local data/logic hooks
  graphql/        # Co-located queries + mutations
```

- Feature-local types go in `features/[section]/types.ts`.
- No barrel files. Import directly from the file that defines the export.

### 2. Apollo vs Context State Split

| What | Where |
|---|---|
| Server data (GraphQL) | Apollo Client hooks (`useQuery`, `useMutation`) |
| UI state (theme, sidebar, locale) | React Context |
| Auth state (user, token) | React Context (`auth.context.tsx`) |
| Permissions | React Context (`ability.context.tsx`) |
| Form fields, modal open/close | Local `useState` |

### 3. Four-State Rendering (Mandatory)

```typescript
const { data, loading, error } = useQuery(GET_ITEMS)

if (loading) return <PageLoader />
if (error) return <ErrorState error={error} onRetry={() => refetch()} />
if (!data?.items?.length) return <EmptyState />

return <ItemList items={data.items} />
```

- Order: loading -> error -> empty -> success. Always.

### 4. CASL Permission Patterns

```typescript
// Programmatic
const ability = useAbility()
if (!ability.can('create', 'Post')) return null

// Declarative
<Can I="delete" a="Group">
  <DeleteGroupButton />
</Can>
```

- Never hardcode role strings. Always use CASL.

### 5. Named Exports Everywhere

Only exception: lazy-loaded page components (`React.lazy()` requires default export).

---

## frontend/design-system

### 1. Color System

| Role | Color |
|---|---|
| Primary accent | `indigo-600` (light) / `indigo-400` (dark) |
| Secondary accent | `amber-*` |
| Neutral | `slate-*` |

Role badge colors: Admin=indigo, Teacher=amber, Student=emerald.

### 2. Typography

- **Inter** (400, 500, 600, 700): headings, body text, UI labels.
- **JetBrains Mono** (400, 500): code blocks, monospace.

### 3. Responsive Sidebar

| Breakpoint | Sidebar |
|---|---|
| Desktop (`lg+`) | 256px, full labels |
| Tablet (`md`) | 72px, icons only |
| Mobile (`<md`) | Hidden, slide-over drawer |

### 4. Dark Mode

All components use Tailwind `dark:` variants. Every component must have both light and dark variants.

### 5. Tailwind v4

CSS-first configuration via `@theme` in `index.css`. No `tailwind.config.js`.

---

## shadcn MCP Server Usage (Frontend Tasks)

For all frontend component work, use the shadcn MCP server tools:

1. **`search_items_in_registries`** — discover available components (card, badge, button, avatar, skeleton, chart, etc.)
2. **`view_items_in_registries`** — inspect component source, props, and usage patterns
3. **`get_add_command_for_items`** — get install commands for missing components
4. **`get_item_examples_from_registries`** — reference implementation examples
5. **`list_items_in_registries`** — browse full component catalog
6. **`get_project_registries`** — check project's shadcn configuration
