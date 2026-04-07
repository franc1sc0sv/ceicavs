# References for Dashboard Role-Based Redesign

## Security Pattern References

### Dual-Layer Auth (established pattern)

**Layer 1 — Resolver:** `@UseGuards(JwtAuthGuard)` verifies JWT, extracts user. No `@Can()` decorator used in current codebase.

**Layer 2 — Handler:** `defineAbilityFor(user.role)` + `ability.can(Action.X, Subject.Y)` inside `handle()`.

**Canonical example:** `apps/api/src/modules/auth/queries/get-me/get-me.handler.ts`
```typescript
protected async handle(query: GetMeQuery, tx: TxClient): Promise<IAuthUser> {
  const ability = defineAbilityFor(query.role)
  if (!ability.can(Action.READ, Subject.USER)) {
    throw new ForbiddenException()
  }
  return this.authRepository.findById(query.userId, tx)
}
```

### CASL Permission Map for Dashboard

| Role | Subjects readable | Dashboard data scoping |
|------|------------------|----------------------|
| ADMIN | `MANAGE ALL` | Global — all users, groups, posts, attendance |
| TEACHER | `USER(R)`, `GROUP(CRUD)`, `ATTENDANCE_RECORD(M)`, `POST(CRUD+P+A+R)`, `ACTIVITY(R)` | Scoped to teacher's groups + own posts |
| STUDENT | `USER(R)`, `GROUP(R)`, `ATTENDANCE_RECORD(R)`, `POST(R+C+S+U+D)`, `ACTIVITY(R)` | Scoped to own data only |

### BaseQueryHandler

**File:** `apps/api/src/common/cqrs/base-query.handler.ts`
- `execute()` wraps in `db.$transaction((tx) => handle(query, tx))`
- Subclasses implement `protected abstract handle(query, tx)`

### RepositoryMethod Type

**File:** `apps/api/src/common/cqrs/types.ts`
```typescript
export type RepositoryMethod<TArgs extends unknown[], TReturn> =
  (...args: [...TArgs, tx: TxClient]) => Promise<TReturn>
```
- `tx: TxClient` required as final parameter — enforced at compile time

## Data Source References

### People Module (User + Group counts)

- **Location**: `apps/api/src/modules/people/`
- **Models**: `User` (soft delete), `Group` (soft delete), `GroupMembership`
- **Admin uses**: `tx.user.count()`, `tx.group.count()`, Prisma `groupBy` for role distribution
- **Teacher uses**: `tx.groupMembership.count({ where: { userId } })` for own groups
- **Student uses**: `tx.groupMembership.count({ where: { userId } })` for memberships
- **Pattern ref**: `queries/get-users/get-users.handler.ts`

### Attendance Module (Rates, trends, streaks)

- **Location**: `apps/api/src/modules/attendance/`
- **Models**: `AttendanceRecord` (composite unique), `AttendanceSubmission` (composite unique)
- **Admin uses**: Kysely global aggregations (`COUNT FILTER`)
- **Teacher uses**: Kysely scoped to teacher's groups via `group_memberships` join
- **Student uses**: Kysely scoped to `user_id = $1`
- **Pattern ref**: `queries/get-student-summary/` (streak + rate), `queries/get-attendance-report/` (aggregation)
- **Repository ref**: `repositories/attendance.repository.abstract.ts` (Kysely + RepositoryMethod)

### Blog Module (Post counts, status distribution)

- **Location**: `apps/api/src/modules/blog/`
- **Models**: `Post` (soft delete, status enum: published/draft/rejected)
- **Admin uses**: `tx.post.count()`, Prisma `groupBy` by status
- **Teacher uses**: `tx.post.count({ where: { authorId: userId } })`
- **Student uses**: `tx.post.count({ where: { authorId: userId, status: 'draft' } })`
- **Pattern ref**: `queries/get-feed/`, `queries/get-my-drafts/`, `queries/get-draft-queue/`

### Activity Model (Activity feed)

- **Schema**: `packages/db/prisma/schema.prisma` — `Activity` model
- **Fields**: `type`, `description`, `actorId`, `actorRole`, `entityId`, `entityType`, `createdAt`
- **Relations**: `actor` → `User` (name + avatar)
- **Indexes**: `@@index([actorId])`, `@@index([createdAt])`
- **Admin**: all activity, ordered by `createdAt desc`
- **Teacher**: join with `group_memberships` to scope to teacher's groups
- **Student**: filter by `actorId = userId`

## Frontend Pattern References

### Existing Dashboard (to be rewritten)
- **File**: `apps/web/src/features/dashboard/DashboardPage.tsx`
- **Current**: Static `StatCard` + `QuickAction` components with hardcoded `"—"` values

### Hook Pattern
- **File**: `apps/web/src/features/blog/hooks/use-blog-feed.ts`
- **Pattern**: `useQuery(QUERY)` → return `{ data, loading, error, refetch }`

### GraphQL Operations Pattern
- **File**: `apps/web/src/features/blog/graphql/blog.queries.ts`
- **Pattern**: `graphql()` from `@/generated/gql` (NOT `gql` from `@apollo/client`)

### CASL Frontend Pattern
- **File**: `apps/web/src/context/ability.context.tsx`
- **Exports**: `Can` component, `useAbility()` hook
- **Quick actions**: wrap in `<Can I={Action.CREATE} a={Subject.POST}>` for permission-gated rendering

### i18n Pattern
- **Files**: `apps/web/src/i18n/es/dashboard.json`, `en/dashboard.json`
- **Pattern**: `useTranslation('dashboard')` → `t('key')`
