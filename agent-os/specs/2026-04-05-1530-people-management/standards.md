# Standards for People Management

The following standards apply to this work.

---

## backend/cqrs-patterns

### 1. Transaction-First Execution
Both commands AND queries run inside `$transaction`. Never call repository methods outside a transaction.

### 2. Event Collection After Commit
Push `IDomainEvent` objects into the `events` array inside `handle()`. The base handler emits them after the transaction commits.

### 3. Repository TxClient Contract
Use `RepositoryMethod<[...args], TReturn>` — makes `tx: TxClient` structurally required at compile time.

```typescript
export abstract class IUserRepository {
  abstract findMany: RepositoryMethod<[filters: IUserFilters], IUser[]>
  abstract create: RepositoryMethod<[data: ICreateUserData], IUser>
  abstract update: RepositoryMethod<[id: string, data: IUpdateUserData], IUser>
  abstract softDelete: RepositoryMethod<[id: string], void>
}
```

### 4. CASL Authorization Inside Handlers (always use enums from `@ceicavs/shared`)
Every handler checks CASL before any DB operation. Admin operations: `ability.can(Action.MANAGE, Subject.USER)`. Teacher group ownership: check `role === UserRole.TEACHER && group.createdBy !== user.id`.

### 5. Thin Resolvers
Resolvers dispatch to CommandBus/QueryBus only. Zero business logic.

---

## database/prisma-kysely-patterns

### Soft Delete
User and Group both have `deletedAt DateTime?`. 
- "Delete" = `update({ data: { deletedAt: new Date() } })`
- Every `findMany` must include `where: { deletedAt: null }`

### TxClient
Import `TxClient` from `@ceicavs/db`. All repository methods require it as first parameter (via `RepositoryMethod` type).

### Snake_case
All `@map()` decorators already set in the existing schema. No changes needed to schema for this feature.

---

## frontend/architecture-patterns

### Feature-First Folders
```
features/people/
  pages/          # PeoplePage (default export for lazy loading)
  components/     # UsersTable, GroupsGrid, UserDialog, GroupDialog, etc.
  hooks/          # usePeopleUsers, usePeopleGroups
  graphql/        # people.operations.graphql
```

No `types.ts` barrel — frontend types come from GraphQL codegen. `UserRole` imported from `@ceicavs/shared`.

### Four-State Rendering
Every data-fetching component handles: loading → error → empty → success (in that order). Use shared `PageLoader`, `ErrorState`, `EmptyState`.

### CASL Permission Patterns
```tsx
import { Action, Subject } from '@ceicavs/shared'
const { t } = useTranslation('people')

<Can I={Action.MANAGE} a={Subject.USER}>
  <TabsTrigger value="users">{t('tabs.users')}</TabsTrigger>
</Can>

<Can I={Action.CREATE} a={Subject.USER}>
  <Button onClick={openAddDialog}>{t('users.addUser')}</Button>
</Can>
```
Never use `role === 'admin'` conditionals for UI rendering. Always use CASL with enum values — never magic strings. All UI text via `useTranslation()` — never hardcoded strings.

### i18n — Strict `useTranslation()` (no hardcoded strings)

Every user-facing string must come from i18n. Never hardcode Spanish (or English) text in components.

```typescript
const { t } = useTranslation('people')

<SheetTitle>{t('dialogs.addUser.title')}</SheetTitle>
<Button>{t('form.save')}</Button>
```

- Namespace per feature: `'people'`
- Shared strings (nav, roles, auth): `'common'` namespace
- Both `es/` and `en/` JSON files must have matching keys
- Interpolation for counts: `t('bulk.selected', { count: 3 })` → "3 seleccionado(s)"

### Named Exports
All components and hooks use named exports. Only `PeoplePage` uses `export default` (for `React.lazy()`).

---

## frontend/design-system

### shadcn Components to Add
Run via shadcn MCP or CLI before building:
- `table` — users table
- `badge` — role badges
- `button` — actions
- `input` — search field
- `select` — group filter dropdown
- `checkbox` — row selection
- `sheet` — all create/edit side panels (user, group, CSV import)
- `alert-dialog` — delete confirmations only
- `form` — form validation integration
- `card` — group cards
- `tabs` — Users / Groups tabs
- `dropdown-menu` — row action menu (edit/delete)
- `separator`

### Sheet Usage Pattern
All create/edit forms use `Sheet` (side sheet), NOT `Dialog`:
```tsx
const { t } = useTranslation('people')

<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right" className="w-[400px] sm:w-[540px]">
    <SheetHeader>
      <SheetTitle>{t('dialogs.addUser.title')}</SheetTitle>
      <SheetDescription>{t('dialogs.addUser.description')}</SheetDescription>
    </SheetHeader>
    <Form ...> ... </Form>
  </SheetContent>
</Sheet>
```
Delete confirmations still use `AlertDialog`.

### Role Badge Colors (match existing design)
- Admin: `bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300`
- Teacher: `bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300`
- Student: `bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300`

### Spanish-First Copy
- "Personas" (page title), "Usuarios" / "Grupos" (tabs)
- "Agregar usuario", "Crear grupo", "Editar", "Eliminar"
- "Docente" for teacher, "Estudiante" for student
- All confirmation dialogs in Spanish
