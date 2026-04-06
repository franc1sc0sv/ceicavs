# People Management — Implementation Plan

## Parallel Execution Strategy

This spec runs in worktrees alongside attendance-fullstack and blog-fullstack. Three files will conflict across all three specs and must be handled via sequential merge after all branches complete:

1. **`apps/api/src/app.module.ts`** — each spec registers its module.
2. **`apps/web/src/router/routes.tsx`** — each spec adds route entries.
3. **`apps/web/src/i18n/index.ts`** — each spec registers a namespace.

**Rule**: Do NOT modify these files in the worktree. Instead, leave a `TODO` comment or note in the PR description. A post-merge integration step will add all three modules/routes/namespaces at once.

### GraphQL Codegen

Backend and frontend run in separate worktrees. The frontend won't have the backend's updated `schema.gql` until merge. Workflow:
1. **Frontend branch**: write operations using `graphql()` from `@/generated/gql` against the agreed schema contract. Operations won't be type-checked until codegen runs.
2. **Post-merge**: run `pnpm --filter @ceicavs/web generate` to regenerate typed operations in `src/generated/`.
3. **Do NOT** use `gql` from `@apollo/client` — always use the generated `graphql()` function.

## Context

Milestone 04 of the CEICAVS MVP. The People section is a centralized admin hub for managing users and groups. It runs as two independent worktrees in Wave 2:
- `feat/04a-people-backend` owns `apps/api/src/modules/people/`
- `feat/04b-people-frontend` owns `apps/web/src/features/people/` + i18n files

Wave 1 (shell) must be merged before starting. The module stub (`PeopleModule {}`) and page stub (`PeoplePage`) already exist.

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/2026-04-05-1530-people-management/` with all spec files.

**Files:**
- `plan.md` (this file)
- `shape.md` — scope, decisions, context
- `standards.md` — relevant standards with key excerpts
- `references.md` — reference implementations
- `visuals/ui-mockup.md` — ASCII mockups for all views

---

## Task 2: Backend — Domain Interfaces + Repositories

**Branch:** `feat/04a-people-backend`
**Path:** `apps/api/src/modules/people/`

### Vertical slice structure to create:
```
modules/people/
  people.module.ts         (already exists, fill it out)
  interfaces/
    user.repository.ts     IUserRepository abstract class
    group.repository.ts    IGroupRepository abstract class
    people.interfaces.ts   IUser, IGroup, IGroupMember, IUserFilters, IGroupFilters,
                           ICreateUserData, IUpdateUserData, ICreateGroupData, IUpdateGroupData, IImportUserRow
  repositories/
    user.repository.ts     UserRepository (Prisma impl)
    group.repository.ts    GroupRepository (Prisma impl)
  types/
    user.type.ts           @ObjectType UserType
    group.type.ts          @ObjectType GroupType
    group-member.type.ts   @ObjectType GroupMemberType
  commands/
    create-user/
    update-user/
    delete-user/
    bulk-delete-users/
    bulk-update-users/
    import-users/
    create-group/
    update-group/
    delete-group/
    add-member-to-group/
    remove-member-from-group/
  queries/
    get-users/
    get-user/
    get-groups/
    get-group/
  resolvers/
    user.resolver.ts
    group.resolver.ts
```

### `IUserRepository` methods (all use `RepositoryMethod`):
- `findMany(filters: IUserFilters)` → `IUser[]`
- `findById(id: string)` → `IUser | null`
- `create(data: ICreateUserData)` → `IUser`
- `update(id: string, data: IUpdateUserData)` → `IUser`
- `softDelete(id: string)` → `void`
- `softDeleteMany(ids: string[])` → `void`
- `updateRole(id: string, role: UserRole)` → `IUser`
- `updateRoleMany(ids: string[], role: UserRole)` → `void`

### `IGroupRepository` methods:
- `findMany(filters: IGroupFilters)` → `IGroup[]`
- `findById(id: string)` → `IGroup | null`
- `findByIdWithMembers(id: string)` → `IGroup & { members: IGroupMember[] } | null`
- `create(data: ICreateGroupData)` → `IGroup`
- `update(id: string, data: IUpdateGroupData)` → `IGroup`
- `softDelete(id: string)` → `void`
- `addMember(groupId: string, userId: string)` → `void`
- `removeMember(groupId: string, userId: string)` → `void`

### Filters:
```typescript
interface IUserFilters {
  search?: string       // name or email ILIKE
  role?: UserRole
  groupId?: string
}
interface IGroupFilters {
  search?: string       // name ILIKE
  createdBy?: string    // for teacher's own groups
}
```

### Soft delete — both repos:
- `findMany` always appends `where: { deletedAt: null }`
- Deletes: `update({ data: { deletedAt: new Date() } })`

---

## Task 3: Backend — User Commands + Handlers

**Each command lives in its own subfolder: `commands/[action]-user/`**

### Commands to implement:

| Command | Handler authorization | Key logic |
|---|---|---|
| `CreateUserCommand` | Admin only | Hash password (or generate temp), create user, emit `UserCreatedEvent` |
| `UpdateUserCommand` | Admin only | Update profile + role + group memberships |
| `DeleteUserCommand` | Admin only | Soft delete, emit `UserDeletedEvent` |
| `BulkDeleteUsersCommand` | Admin only | `softDeleteMany(ids)` |
| `BulkUpdateUsersCommand` | Admin only | `updateRoleMany(ids, role)` or update groups |
| `ImportUsersCommand` | Admin only | Parse rows, validate each, batch create valid rows, return `{ created, skipped, errors }` |

### `ImportUsersCommand` input:
```typescript
class ImportUsersInput {
  @IsArray()
  rows: IImportUserRow[]
}
```
Return type: `ImportUsersResult { created: number; skipped: number; errors: string[] }`

### Events to emit:
- `UserCreatedEvent { userId, role, occurredAt }`
- `UserDeletedEvent { userId, occurredAt }`

---

## Task 4: Backend — Group Commands + Handlers

### Commands:

| Command | Handler authorization | Key logic |
|---|---|---|
| `CreateGroupCommand` | Admin + Teacher | Create group with `createdBy = currentUser.id` |
| `UpdateGroupCommand` | Admin + Teacher (own) | Teacher: verify `group.createdBy === user.id` before update |
| `DeleteGroupCommand` | Admin + Teacher (own) | Soft delete; Teacher: verify ownership |
| `AddMemberToGroupCommand` | Admin + Teacher (own) | Insert `GroupMembership`; verify user exists and isn't already a member |
| `RemoveMemberFromGroupCommand` | Admin + Teacher (own) | Delete `GroupMembership` |

### Teacher ownership check (inside handler):
```typescript
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'

const group = await groupRepo.findById(command.groupId, tx)
if (command.user.role === UserRole.TEACHER && group.createdBy !== command.user.id) {
  throw new ForbiddenException()
}
if (!ability.can(Action.MANAGE, Subject.GROUP)) {
  throw new ForbiddenException()
}
```

---

## Task 5: Backend — Queries + Handlers

| Query | Authorization | Returns |
|---|---|---|
| `GetUsersQuery` | Admin (Teacher gets empty/forbidden) | `IUser[]` with filters |
| `GetUserQuery` | Admin | `IUser | null` |
| `GetGroupsQuery` | Admin + Teacher (filtered by `createdBy` for Teacher) | `IGroup[]` |
| `GetGroupQuery` | Admin + Teacher (own) | `IGroup & { members }` |

### Teacher auto-filter in `GetGroupsQuery`:
```typescript
import { UserRole } from '@ceicavs/shared'

const isTeacher = query.user.role === UserRole.TEACHER
const filters = isTeacher ? { ...query.filters, createdBy: query.user.id } : query.filters
```

---

## Task 6: Backend — Resolvers + Module Registration

### `UserResolver`:
```
Query getUsers(filters): [UserType!]!
Query getUser(id): UserType
Mutation createUser(input): UserType!
Mutation updateUser(id, input): UserType!
Mutation deleteUser(id): Boolean!
Mutation bulkDeleteUsers(ids): Boolean!
Mutation bulkUpdateUsers(ids, input): Boolean!
Mutation importUsers(input): ImportUsersResultType!
```

### `GroupResolver`:
```
Query getGroups(filters): [GroupType!]!
Query getGroup(id): GroupType
Mutation createGroup(input): GroupType!
Mutation updateGroup(id, input): GroupType!
Mutation deleteGroup(id): Boolean!
Mutation addMemberToGroup(groupId, userId): Boolean!
Mutation removeMemberFromGroup(groupId, userId): Boolean!
```

### `PeopleModule` DI wiring:
```typescript
@Module({
  imports: [CqrsModule],
  providers: [
    UserResolver,
    GroupResolver,
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IGroupRepository, useClass: GroupRepository },
    ...commandHandlers,
    ...queryHandlers,
  ],
})
```

Register `PeopleModule` in `apps/api/src/app.module.ts` imports array (it was stubbed by shell-backend).

---

## Task 7: Frontend — GraphQL Operations + Types + Hooks

**Branch:** `feat/04b-people-frontend`
**Path:** `apps/web/src/features/people/`

### GraphQL operations file: `graphql/people.operations.graphql`

Include fragments + all queries + all mutations matching the backend resolvers above.

Key fragments:
```graphql
fragment UserFields on UserType {
  id name email role groups { id name } createdAt
}
fragment GroupFields on GroupType {
  id name description memberCount createdBy createdAt
}
```

Do NOT create a `types.ts` barrel in the feature folder. Frontend types come from GraphQL codegen. `UserRole` is imported from `@ceicavs/shared` — never redeclare it locally.

### Hooks (in `hooks/`):
- `usePeopleUsers(filters)` — `useQuery(GET_USERS, { variables: { filters } })`
- `usePeopleGroups(filters)` — `useQuery(GET_GROUPS, ...)`
- `useUserMutations()` — wraps createUser, updateUser, deleteUser, bulkDelete, bulkUpdate, importUsers mutations with cache invalidation
- `useGroupMutations()` — wraps createGroup, updateGroup, deleteGroup, addMember, removeMember

---

## Task 8: Frontend — shadcn Components Setup

### Add via shadcn MCP (or CLI):
```bash
pnpm dlx shadcn@latest add table badge button input select checkbox \
  sheet alert-dialog form card tabs dropdown-menu separator
```

### Components to build in `components/`:

**UsersTab:**
- `UsersTable` — shadcn `Table` with `Checkbox` column, `Badge` for role, group chips, `DropdownMenu` for actions
- `UserSheet` — shadcn `Sheet` (side="right") + `Form` for both create and edit (controlled by `mode: 'create' | 'edit'`)
- `BulkToolbar` — fixed floating bar, appears when `selected.size > 0`
- `DeleteUsersAlert` — shadcn `AlertDialog` for single + bulk delete

**GroupsTab:**
- `GroupsGrid` — responsive card grid using shadcn `Card`
- `GroupSheet` — shadcn `Sheet` (side="right") + `Form` for create/edit
- `DeleteGroupAlert` — shadcn `AlertDialog`

**Shared:**
- `CsvImportSheet` — shadcn `Sheet` (side="right") with file `<input type="file" accept=".csv">`, parse with `Papa.parse`, show preview table, call `importUsers` mutation on confirm

### Filtering logic (mirror PeopleList prototype):
Use `useMemo` for client-side filter: search (name + email), role filter, group filter. All three are AND conditions.

---

## Task 9: Frontend — PeoplePage + i18n

### `pages/PeoplePage.tsx` (default export):
```tsx
export default function PeoplePage() {
  const { t } = useTranslation('people')

  return (
    <Tabs defaultValue="users">
      <Can I={Action.MANAGE} a={Subject.USER}>
        <TabsTrigger value="users">{t('tabs.users')}</TabsTrigger>
      </Can>
      <TabsTrigger value="groups">{t('tabs.groups')}</TabsTrigger>

      <Can I={Action.MANAGE} a={Subject.USER}>
        <TabsContent value="users"><UsersTabContent /></TabsContent>
      </Can>
      <TabsContent value="groups"><GroupsTabContent /></TabsContent>
    </Tabs>
  )
}
```

### i18n files:

`apps/web/src/i18n/es/people.json`:
```json
{
  "title": "Personas",
  "tabs": { "users": "Usuarios", "groups": "Grupos" },
  "users": {
    "addUser": "+ Agregar usuario",
    "searchPlaceholder": "Buscar por nombre o correo...",
    "columns": { "name": "Nombre", "email": "Correo", "role": "Rol", "groups": "Grupos", "actions": "Acciones" },
    "edit": "Editar",
    "delete": "Eliminar"
  },
  "groups": {
    "createGroup": "+ Crear grupo",
    "searchPlaceholder": "Buscar grupos...",
    "members": "{{count}} miembro(s)",
    "edit": "Editar",
    "delete": "Eliminar"
  },
  "dialogs": {
    "addUser": { "title": "Agregar usuario", "description": "Completa la información del nuevo usuario" },
    "editUser": { "title": "Editar usuario" },
    "createGroup": { "title": "Crear grupo", "description": "Completa la información del nuevo grupo" },
    "editGroup": { "title": "Editar grupo" },
    "delete": {
      "title": "Eliminar {{count}} usuario(s)",
      "warning": "Esta acción no se puede deshacer. Los usuarios serán eliminados permanentemente de la plataforma.",
      "confirm": "Eliminar",
      "cancel": "Cancelar"
    }
  },
  "bulk": {
    "selected": "{{count}} seleccionado(s)",
    "changeRole": "Cambiar rol",
    "delete": "Eliminar"
  },
  "import": {
    "title": "Importar desde CSV",
    "description": "name, email, role requeridos",
    "dropHint": "Arrastra tu CSV o haz clic para abrir",
    "import": "Importar {{count}}",
    "cancel": "Cancelar"
  },
  "filters": {
    "all": "Todos",
    "admin": "Admin",
    "teacher": "Docente",
    "student": "Est."
  },
  "form": {
    "save": "Guardar",
    "cancel": "Cancelar"
  }
}
```

`apps/web/src/i18n/en/people.json` — English equivalents with same key structure.

All code examples in this spec MUST use `const { t } = useTranslation('people')` — never hardcoded Spanish strings.

---

## Verification

### Backend:
1. `pnpm -r typecheck` — must pass with zero errors
2. `pnpm --filter @ceicavs/api dev` — server starts, no runtime errors
3. Open Apollo Sandbox → run `getUsers`, `getGroups` queries → returns data
4. Run `createUser` mutation → verify user appears in DB with correct role
5. Run `deleteUser` → verify `deletedAt` is set, user excluded from `getUsers`
6. Run `importUsers` with valid + invalid rows → verify `created`/`skipped` counts

### Frontend:
1. After backend merge: `pnpm --filter @ceicavs/web generate` — regenerates typed operations from `schema.gql`
2. `pnpm --filter @ceicavs/web dev` — app starts, People route loads
2. Admin login → Users tab visible, all 4 states work (loading, error, empty, data)
3. Create user via dialog → appears in table
4. Select rows → bulk toolbar appears → bulk delete works
5. CSV import → preview renders → import submits
6. Teacher login → Users tab hidden, Groups tab shows only own groups
7. Student login → redirected/empty state on /people

### Type check gates:
- No `any` types introduced
- All `RepositoryMethod` signatures match implementation
- GraphQL `@InputType` classes have `class-validator` decorators
