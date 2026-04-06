# Standards for Attendance (Fullstack)

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

Never call a repository method outside a transaction.

### 2. Event Collection After Commit

Domain events are collected during `handle()`, emitted AFTER the transaction commits.

```typescript
protected abstract handle(
  command: TCommand,
  tx: TxClient,
  events: IDomainEvent[],
): Promise<TResult>
```

Push events inside `handle()`, never call `eventEmitter.emit()` directly.

### 3. Repository TxClient Contract

`tx: TxClient` is always **required** in repository methods — never optional, no fallbacks.

```typescript
export abstract class IAttendanceRepository {
  abstract findGroupsForAdmin: RepositoryMethod<[], IAttendanceGroup[]>
  abstract findGroupsForTeacher: RepositoryMethod<[userId: string], IAttendanceGroup[]>
}
```

### 4. CASL Authorization Inside Handlers

Every handler checks CASL inside `handle()`. No exceptions.

```typescript
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'

protected async handle(command: RecordAttendanceCommand, tx: TxClient, events: IDomainEvent[]) {
  const ability = defineAbilityFor(command.user.role)
  if (!ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)) {
    throw new ForbiddenException()
  }
}
```

### 5. Thin Resolvers

Resolvers dispatch to `CommandBus`/`QueryBus`. Zero business logic.

```typescript
@Mutation(() => Boolean)
async recordAttendance(
  @Args('input') input: RecordAttendanceInput,
  @CurrentUser() user: IJwtUser,
): Promise<boolean> {
  return this.commandBus.execute(new RecordAttendanceCommand(input, user))
}
```

---

## database/prisma-kysely-patterns

### 1. Prisma 7 + PrismaPg Adapter

Import `PrismaClient` from `./generated/client/client`. Pass connection string directly to `PrismaPg`. Never use `Pool`.

### 2. Kysely DummyDriver (Query Building Only)

Use Kysely for complex queries (aggregations, joins, CTEs) that Prisma can't express.

```typescript
const compiled = kysely.selectFrom('attendance_records')
  .where('group_id', '=', groupId)
  .select([...])
  .compile()

const rows = await tx.$queryRawUnsafe(compiled.sql, ...compiled.parameters)
```

Kysely never connects to the database — it only builds SQL strings.

### 3. Soft Delete Convention

Group and User have `deletedAt`. Always add `where: { deletedAt: null }` when querying these entities.

AttendanceRecord and AttendanceSubmission do NOT have soft delete — use hard delete if needed.

---

## frontend/architecture-patterns

### 1. Feature-First Folders

```
features/attendance/
  attendance-page.tsx  ← top-level entry (lazy-loaded default export)
  components/          ← adapted UI components (kebab-case filenames)
  hooks/               ← Apollo + local state hooks
  graphql/             ← co-located queries + mutations
```

No `types.ts` barrel — frontend types come from GraphQL codegen.

No barrel files. Import directly from the defining file.

### 2. Apollo vs Context State Split

| What | Where |
|---|---|
| Server data (attendance groups, roster, reports) | Apollo Client hooks (`useQuery`, `useMutation`) |
| Selected group, selected date, roster changes | Local `useState` in page component |
| Auth, role | React Context (`auth.context.tsx`) |
| Permissions | React Context (`ability.context.tsx`) |

### 3. Four-State Rendering (Mandatory)

```typescript
const { data, loading, error } = useQuery(GET_ATTENDANCE_GROUPS)

if (loading) return <PageLoader />
if (error) return <ErrorState error={error} onRetry={() => refetch()} />
if (!data?.attendanceGroups?.length) return <EmptyState />

return <AttendanceView ... />
```

Order: loading → error → empty → success. Always.

### 4. CASL Permission Patterns

```typescript
import { Action, Subject } from '@ceicavs/shared'

const ability = useAbility()
// programmatic
if (!ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)) return null
// declarative
<Can I={Action.MANAGE} a={Subject.ATTENDANCE_RECORD}>
  <SubmitButton />
</Can>
```

### 5. i18n — Strict `useTranslation()` (no hardcoded strings)

Every user-facing string must come from i18n. Never hardcode Spanish (or English) text in components.

```typescript
const { t } = useTranslation('attendance')

<TabsTrigger value="roster">{t('tabs.roster')}</TabsTrigger>
<Button>{t('actions.submit')}</Button>
```

- Namespace per feature: `'attendance'`, `'people'`, `'blog'`
- Shared strings (nav, roles, auth): `'common'` namespace
- Both `es/` and `en/` JSON files must have matching keys
- Interpolation for counts: `t('pending', { count: 3 })` → "3 grupo(s) sin asistencia..."

### 6. Named Exports Everywhere

Exception: lazy-loaded page components require default export.

```typescript
// AttendancePage.tsx (lazy-loaded entry)
export default function AttendancePage() { ... }

// hooks, components
export function useAttendanceGroups() { ... }
export function GroupCard() { ... }
```
