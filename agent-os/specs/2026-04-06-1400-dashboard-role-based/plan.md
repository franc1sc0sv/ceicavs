# Dashboard Role-Based Redesign — Implementation Plan

## Execution Model

Single branch: `feat/dashboard-redesign`. Backend first (Tasks 2-8), then frontend (Tasks 9-15). Frontend needs `schema.gql` updated by the backend before running codegen.

## Security Model: One Query Per Role

Instead of a single `DashboardStats` type with nullable fields, each role gets its own query, handler, return type, and CASL enforcement. Zero over-fetching, strong types, granular authorization.

## GraphQL Schema Contract

```graphql
type DashboardPostsByStatus {
  published: Int!
  draft: Int!
  rejected: Int!
}

type DashboardUsersByRole {
  admin: Int!
  teacher: Int!
  student: Int!
}

type AttendanceDayPoint {
  date: String!
  rate: Float!
}

type AttendanceGroupLine {
  groupId: ID!
  groupName: String!
  points: [AttendanceDayPoint!]!
}

type StudentAttendanceDayPoint {
  date: String!
  status: String
}

# --- Per-Role Dashboard Types (all fields non-nullable) ---

type AdminDashboardStats {
  totalUsers: Int!
  totalGroups: Int!
  publishedPostsThisMonth: Int!
  publishedPostsLastMonth: Int!
  globalAttendanceRateThisWeek: Float!
  globalAttendanceRateLastWeek: Float!
  usersByRole: DashboardUsersByRole!
  postsByStatus: DashboardPostsByStatus!
  attendanceTrend: [AttendanceDayPoint!]!
}

type TeacherDashboardStats {
  myGroupCount: Int!
  myGroupsTodayRate: Float!
  myPostCount: Int!
  pendingAttendanceCount: Int!
  myGroupAttendanceTrend: [AttendanceGroupLine!]!
  myPostsByStatus: DashboardPostsByStatus!
}

type StudentDashboardStats {
  myAttendanceRate: Float!
  myCurrentStreak: Int!
  myDraftCount: Int!
  myGroupMembershipCount: Int!
  myAttendanceTrend: [StudentAttendanceDayPoint!]!
}

# --- Activity (shared, scoped inside handler) ---

type ActivityItem {
  id: ID!
  type: String!
  description: String!
  actorName: String!
  actorAvatarUrl: String
  actorRole: UserRole!
  entityId: String
  entityType: String
  createdAt: DateTime!
}

# --- Queries ---

type Query {
  adminDashboard: AdminDashboardStats!
  teacherDashboard: TeacherDashboardStats!
  studentDashboard: StudentDashboardStats!
  recentActivity(limit: Int): [ActivityItem!]!
}
```

**Key difference from original design:** Each role query returns a dedicated type with all fields non-nullable. If a student calls `adminDashboard`, the handler throws `ForbiddenException` before any data is fetched.

---

## Task 1: Save Spec Documentation

Create this spec folder with plan.md, shape.md, references.md, standards.md, and visuals/.

---

## Backend Tasks

### Task 2: Shared GraphQL Types + Interfaces

**Create in `apps/api/src/modules/dashboard/`:**

`interfaces/dashboard.interfaces.ts`:
```typescript
export interface IDashboardPostsByStatus {
  published: number
  draft: number
  rejected: number
}

export interface IDashboardUsersByRole {
  admin: number
  teacher: number
  student: number
}

export interface IAttendanceDayPoint {
  date: string
  rate: number
}

export interface IAttendanceGroupLine {
  groupId: string
  groupName: string
  points: IAttendanceDayPoint[]
}

export interface IStudentAttendanceDayPoint {
  date: string
  status: string | null
}

export interface IAdminDashboardStats {
  totalUsers: number
  totalGroups: number
  publishedPostsThisMonth: number
  publishedPostsLastMonth: number
  globalAttendanceRateThisWeek: number
  globalAttendanceRateLastWeek: number
  usersByRole: IDashboardUsersByRole
  postsByStatus: IDashboardPostsByStatus
  attendanceTrend: IAttendanceDayPoint[]
}

export interface ITeacherDashboardStats {
  myGroupCount: number
  myGroupsTodayRate: number
  myPostCount: number
  pendingAttendanceCount: number
  myGroupAttendanceTrend: IAttendanceGroupLine[]
  myPostsByStatus: IDashboardPostsByStatus
}

export interface IStudentDashboardStats {
  myAttendanceRate: number
  myCurrentStreak: number
  myDraftCount: number
  myGroupMembershipCount: number
  myAttendanceTrend: IStudentAttendanceDayPoint[]
}

export interface IActivityItem {
  id: string
  type: string
  description: string
  actorName: string
  actorAvatarUrl: string | null
  actorRole: string
  entityId: string | null
  entityType: string | null
  createdAt: Date
}
```

`types/` — One `@ObjectType()` class per GraphQL type:
- `dashboard-posts-by-status.type.ts`
- `dashboard-users-by-role.type.ts`
- `attendance-day-point.type.ts`
- `attendance-group-line.type.ts`
- `student-attendance-day-point.type.ts`
- `admin-dashboard-stats.type.ts` — ALL fields `@Field(() => Int!)` (non-nullable)
- `teacher-dashboard-stats.type.ts` — ALL fields non-nullable
- `student-dashboard-stats.type.ts` — ALL fields non-nullable
- `activity-item.type.ts`

### Task 3: Dashboard Repository

`repositories/dashboard.repository.abstract.ts` — Abstract class `IDashboardRepository`:

```typescript
// Admin stats — global aggregations
abstract countActiveUsers: RepositoryMethod<[], number>
abstract countActiveGroups: RepositoryMethod<[], number>
abstract countPostsByStatusInRange: RepositoryMethod<[from: Date, to: Date], IDashboardPostsByStatus>
abstract countAllPostsByStatus: RepositoryMethod<[], IDashboardPostsByStatus>
abstract computeGlobalAttendanceRateInRange: RepositoryMethod<[from: Date, to: Date], number>
abstract countUsersByRole: RepositoryMethod<[], IDashboardUsersByRole>
abstract computeGlobalAttendanceTrend: RepositoryMethod<[days: number], IAttendanceDayPoint[]>

// Teacher stats — scoped to teacher's groups
abstract countGroupsForTeacher: RepositoryMethod<[userId: string], number>
abstract computeTeacherGroupsTodayRate: RepositoryMethod<[userId: string], number>
abstract countPostsForUser: RepositoryMethod<[userId: string], number>
abstract countPendingAttendanceForTeacher: RepositoryMethod<[userId: string], number>
abstract computeTeacherGroupAttendanceTrend: RepositoryMethod<[userId: string, days: number], IAttendanceGroupLine[]>
abstract countPostsByStatusForUser: RepositoryMethod<[userId: string], IDashboardPostsByStatus>

// Student stats — scoped to own data
abstract computeStudentAttendanceRate: RepositoryMethod<[userId: string], number>
abstract computeStudentStreak: RepositoryMethod<[userId: string], number>
abstract countDraftsForUser: RepositoryMethod<[userId: string], number>
abstract countGroupMemberships: RepositoryMethod<[userId: string], number>
abstract computeStudentAttendanceTrend: RepositoryMethod<[userId: string, days: number], IStudentAttendanceDayPoint[]>

// Activity — scoped by role
abstract findRecentActivityAll: RepositoryMethod<[limit: number], IActivityItem[]>
abstract findRecentActivityForTeacher: RepositoryMethod<[userId: string, limit: number], IActivityItem[]>
abstract findRecentActivityForUser: RepositoryMethod<[userId: string, limit: number], IActivityItem[]>
```

`repositories/dashboard.repository.ts` — Concrete implementation:
- Simple counts: Prisma `tx.user.count({ where: { deletedAt: null } })`
- Aggregations: Kysely `COUNT(*) FILTER (WHERE status = 'present') / COUNT(*)` via `tx.$queryRawUnsafe()`
- Teacher scoping: Join `group_memberships` to filter by teacher's groups
- Student scoping: Always filter by `userId`
- Always filter `deletedAt: null` for soft-deleted entities

### Task 4: GetAdminDashboard Query Handler

`queries/get-admin-dashboard/get-admin-dashboard.query.ts`:
```typescript
export class GetAdminDashboardQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
```

`queries/get-admin-dashboard/get-admin-dashboard.handler.ts`:
- Extends `BaseQueryHandler<GetAdminDashboardQuery, IAdminDashboardStats>`
- **CASL check:** `ability.can(Action.MANAGE, Subject.ALL)` — only admins pass
- Parallel await ALL admin repository methods
- Returns `IAdminDashboardStats` with all fields populated

```typescript
protected async handle(query: GetAdminDashboardQuery, tx: TxClient): Promise<IAdminDashboardStats> {
  const ability = defineAbilityFor(query.role)
  if (!ability.can(Action.MANAGE, Subject.ALL)) {
    throw new ForbiddenException()
  }

  const [totalUsers, totalGroups, postsThisMonth, postsLastMonth, rateThisWeek, rateLastWeek, usersByRole, postsByStatus, attendanceTrend] = await Promise.all([
    this.dashboardRepository.countActiveUsers(tx),
    this.dashboardRepository.countActiveGroups(tx),
    this.dashboardRepository.countPostsByStatusInRange(startOfMonth, endOfMonth, tx),
    this.dashboardRepository.countPostsByStatusInRange(startOfLastMonth, endOfLastMonth, tx),
    this.dashboardRepository.computeGlobalAttendanceRateInRange(startOfWeek, endOfWeek, tx),
    this.dashboardRepository.computeGlobalAttendanceRateInRange(startOfLastWeek, endOfLastWeek, tx),
    this.dashboardRepository.countUsersByRole(tx),
    this.dashboardRepository.countAllPostsByStatus(tx),
    this.dashboardRepository.computeGlobalAttendanceTrend(7, tx),
  ])

  return {
    totalUsers,
    totalGroups,
    publishedPostsThisMonth: postsThisMonth.published,
    publishedPostsLastMonth: postsLastMonth.published,
    globalAttendanceRateThisWeek: rateThisWeek,
    globalAttendanceRateLastWeek: rateLastWeek,
    usersByRole,
    postsByStatus,
    attendanceTrend,
  }
}
```

### Task 5: GetTeacherDashboard Query Handler

`queries/get-teacher-dashboard/get-teacher-dashboard.query.ts` + handler

- Extends `BaseQueryHandler<GetTeacherDashboardQuery, ITeacherDashboardStats>`
- **CASL checks (granular):**
  - `ability.can(Action.READ, Subject.GROUP)` — needed for group count
  - `ability.can(Action.READ, Subject.ATTENDANCE_RECORD)` — needed for attendance rate
  - `ability.can(Action.READ, Subject.POST)` — needed for post count
  - If ANY check fails → `ForbiddenException`
- Parallel await teacher repository methods (all scoped by `userId`)
- Returns `ITeacherDashboardStats`

### Task 6: GetStudentDashboard Query Handler

`queries/get-student-dashboard/get-student-dashboard.query.ts` + handler

- Extends `BaseQueryHandler<GetStudentDashboardQuery, IStudentDashboardStats>`
- **CASL checks:**
  - `ability.can(Action.READ, Subject.ATTENDANCE_RECORD)` — needed for attendance rate + streak
  - `ability.can(Action.READ, Subject.POST)` — needed for draft count
  - If ANY check fails → `ForbiddenException`
- Parallel await student repository methods (all scoped by `userId`)
- Returns `IStudentDashboardStats`

### Task 7: GetRecentActivity Query Handler

`queries/get-recent-activity/get-recent-activity.query.ts` + handler

- Extends `BaseQueryHandler<GetRecentActivityQuery, IActivityItem[]>`
- **CASL check:** `ability.can(Action.READ, Subject.ACTIVITY)` — all roles have this
- Scopes data by role:
  - Admin: `findRecentActivityAll(limit, tx)`
  - Teacher: `findRecentActivityForTeacher(userId, limit, tx)`
  - Student: `findRecentActivityForUser(userId, limit, tx)`

### Task 8: Dashboard Resolver + Module Assembly

`resolvers/dashboard.resolver.ts`:
```typescript
@Resolver()
export class DashboardResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => AdminDashboardStatsType)
  @UseGuards(JwtAuthGuard)
  async adminDashboard(@CurrentUser() user: IJwtUser): Promise<IAdminDashboardStats> {
    return this.queryBus.execute(new GetAdminDashboardQuery(user.id, user.role))
  }

  @Query(() => TeacherDashboardStatsType)
  @UseGuards(JwtAuthGuard)
  async teacherDashboard(@CurrentUser() user: IJwtUser): Promise<ITeacherDashboardStats> {
    return this.queryBus.execute(new GetTeacherDashboardQuery(user.id, user.role))
  }

  @Query(() => StudentDashboardStatsType)
  @UseGuards(JwtAuthGuard)
  async studentDashboard(@CurrentUser() user: IJwtUser): Promise<IStudentDashboardStats> {
    return this.queryBus.execute(new GetStudentDashboardQuery(user.id, user.role))
  }

  @Query(() => [ActivityItemType])
  @UseGuards(JwtAuthGuard)
  async recentActivity(
    @CurrentUser() user: IJwtUser,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number,
  ): Promise<IActivityItem[]> {
    return this.queryBus.execute(new GetRecentActivityQuery(user.id, user.role, limit))
  }
}
```

Update `dashboard.module.ts`:
```typescript
@Module({
  imports: [CqrsModule],
  providers: [
    DashboardResolver,
    { provide: IDashboardRepository, useClass: DashboardRepository },
    GetAdminDashboardHandler,
    GetTeacherDashboardHandler,
    GetStudentDashboardHandler,
    GetRecentActivityHandler,
  ],
})
export class DashboardModule {}
```

---

## Frontend Tasks

### Task 9: shadcn Component Audit + Install recharts

**Use shadcn MCP server:**
1. `search_items_in_registries` for: card, badge, button, avatar, skeleton, separator, tooltip
2. `view_items_in_registries` to check existing patterns and usage examples
3. `get_add_command_for_items` to install any missing components
4. `get_item_examples_from_registries` for chart-related UI patterns

**Install recharts:** `pnpm --filter @ceicavs/web add recharts`

### Task 10: Feature Folder + GraphQL Operations

Restructure `apps/web/src/features/dashboard/`:

```
dashboard/
├── DashboardPage.tsx
├── components/
│   ├── admin-dashboard.tsx          # Admin-specific section
│   ├── teacher-dashboard.tsx        # Teacher-specific section
│   ├── student-dashboard.tsx        # Student-specific section
│   ├── stat-card.tsx                # Shared: card with icon + value + trend
│   ├── activity-feed.tsx            # Shared: activity list
│   ├── activity-item.tsx            # Shared: single activity row
│   ├── quick-action.tsx             # Shared: button with icon + label
│   ├── quick-actions-grid.tsx       # Shared: role-aware grid
│   ├── attendance-line-chart.tsx    # Admin + Teacher
│   ├── posts-donut-chart.tsx        # Admin + Teacher
│   ├── users-bar-chart.tsx          # Admin only
│   ├── student-attendance-chart.tsx # Student only
│   └── dashboard-skeleton.tsx       # Shared: loading skeleton
├── hooks/
│   ├── use-admin-dashboard.ts       # Calls GET_ADMIN_DASHBOARD
│   ├── use-teacher-dashboard.ts     # Calls GET_TEACHER_DASHBOARD
│   ├── use-student-dashboard.ts     # Calls GET_STUDENT_DASHBOARD
│   └── use-recent-activity.ts       # Calls GET_RECENT_ACTIVITY
└── graphql/
    └── dashboard.queries.ts         # 4 separate queries
```

`graphql/dashboard.queries.ts` — **Per-role queries, zero over-fetching:**

```typescript
import { graphql } from '@/generated/gql'

export const GET_ADMIN_DASHBOARD = graphql(`
  query GetAdminDashboard {
    adminDashboard {
      totalUsers
      totalGroups
      publishedPostsThisMonth
      publishedPostsLastMonth
      globalAttendanceRateThisWeek
      globalAttendanceRateLastWeek
      usersByRole { admin teacher student }
      postsByStatus { published draft rejected }
      attendanceTrend { date rate }
    }
  }
`)

export const GET_TEACHER_DASHBOARD = graphql(`
  query GetTeacherDashboard {
    teacherDashboard {
      myGroupCount
      myGroupsTodayRate
      myPostCount
      pendingAttendanceCount
      myGroupAttendanceTrend { groupId groupName points { date rate } }
      myPostsByStatus { published draft rejected }
    }
  }
`)

export const GET_STUDENT_DASHBOARD = graphql(`
  query GetStudentDashboard {
    studentDashboard {
      myAttendanceRate
      myCurrentStreak
      myDraftCount
      myGroupMembershipCount
      myAttendanceTrend { date status }
    }
  }
`)

export const GET_RECENT_ACTIVITY = graphql(`
  query GetRecentActivity($limit: Int) {
    recentActivity(limit: $limit) {
      id type description actorName actorAvatarUrl actorRole
      entityId entityType createdAt
    }
  }
`)
```

### Task 11: Per-Role Hooks

Each hook calls only its role's query. Codegen types are fully non-nullable.

```typescript
// use-admin-dashboard.ts
export function useAdminDashboard() {
  const { data, loading, error, refetch } = useQuery(GET_ADMIN_DASHBOARD)
  return { stats: data?.adminDashboard ?? null, loading, error, refetch }
}

// use-teacher-dashboard.ts
export function useTeacherDashboard() {
  const { data, loading, error, refetch } = useQuery(GET_TEACHER_DASHBOARD)
  return { stats: data?.teacherDashboard ?? null, loading, error, refetch }
}

// use-student-dashboard.ts
export function useStudentDashboard() {
  const { data, loading, error, refetch } = useQuery(GET_STUDENT_DASHBOARD)
  return { stats: data?.studentDashboard ?? null, loading, error, refetch }
}

// use-recent-activity.ts
export function useRecentActivity(limit: number = 10) {
  const { data, loading, error, refetch } = useQuery(GET_RECENT_ACTIVITY, { variables: { limit } })
  return { activities: data?.recentActivity ?? [], loading, error, refetch }
}
```

### Task 12: Chart Components

All use recharts. Use shadcn MCP for chart-related UI patterns.

- `attendance-line-chart.tsx` — `<LineChart>` (admin: single line, teacher: multi-line per group)
- `posts-donut-chart.tsx` — `<PieChart>` with `innerRadius` (published=green, draft=amber, rejected=red)
- `users-bar-chart.tsx` — `<BarChart>` admin-only (admin=indigo, teacher=emerald, student=sky)
- `student-attendance-chart.tsx` — `<BarChart>` student-only (present=green, absent=red, late=amber, excused=blue)

### Task 13: Shared Dashboard Components

Use shadcn MCP `get_item_examples_from_registries` for Card, Avatar, Badge patterns.

- `stat-card.tsx` — Card + icon + label + value + optional trend badge (green up / red down)
- `activity-feed.tsx` — List with 5 skeleton rows on loading + empty state
- `activity-item.tsx` — Avatar + actor name + description + relative time + entity link
- `quick-action.tsx` — Button with icon + label + navigation
- `quick-actions-grid.tsx` — Each action wrapped in `<Can>` where permission required
- `dashboard-skeleton.tsx` — 4 skeleton stat cards + skeleton activity feed + skeleton chart area

### Task 14: Per-Role Dashboard Sections + DashboardPage

**Per-role section components** — each handles its own data fetching + rendering:

`components/admin-dashboard.tsx`:
```typescript
export function AdminDashboard() {
  const { stats, loading, error, refetch } = useAdminDashboard()
  const { activities, loading: activityLoading } = useRecentActivity(10)

  if (loading) return <DashboardSkeleton chartCount={3} />
  if (error) return <ErrorState error={error} onRetry={refetch} />

  return (
    <>
      <StatsGrid>
        <StatCard icon={Users} label={t('cards.users')} value={stats.totalUsers} href={ROUTES.PEOPLE} />
        <StatCard icon={UsersRound} label={t('cards.groups')} value={stats.totalGroups} href={ROUTES.PEOPLE} />
        <StatCard icon={FileText} label={t('cards.postsThisMonth')} value={stats.publishedPostsThisMonth} href={ROUTES.BLOG}
          trend={computeTrend(stats.publishedPostsThisMonth, stats.publishedPostsLastMonth)} />
        <StatCard icon={ClipboardCheck} label={t('cards.attendanceThisWeek')} value={formatPercent(stats.globalAttendanceRateThisWeek)} href={ROUTES.ATTENDANCE}
          trend={computeTrend(stats.globalAttendanceRateThisWeek, stats.globalAttendanceRateLastWeek)} />
      </StatsGrid>

      <TwoColumnLayout>
        <ActivityFeed activities={activities} loading={activityLoading} />
        <ChartsSection>
          <AttendanceLineChart data={stats.attendanceTrend} />
          <PostsDonutChart data={stats.postsByStatus} />
          <UsersBarChart data={stats.usersByRole} />
        </ChartsSection>
      </TwoColumnLayout>

      <QuickActionsGrid role={UserRole.ADMIN} />
    </>
  )
}
```

`components/teacher-dashboard.tsx` — same pattern with `useTeacherDashboard()`, teacher stats + 2 charts
`components/student-dashboard.tsx` — same pattern with `useStudentDashboard()`, student stats + 1 chart

**`DashboardPage.tsx`** — thin router by role:
```typescript
export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useTranslation('dashboard')

  return (
    <div className="space-y-8">
      <DashboardHeader name={user.name} role={user.role} />
      {user.role === UserRole.ADMIN && <AdminDashboard />}
      {user.role === UserRole.TEACHER && <TeacherDashboard />}
      {user.role === UserRole.STUDENT && <StudentDashboard />}
    </div>
  )
}
```

### Task 15: i18n Translations

Replace both `apps/web/src/i18n/es/dashboard.json` and `en/dashboard.json` with expanded keys:
- `sections` — overview, quickActions, activity, analytics
- `cards` — per-role stat card labels
- `actions` — per-role quick action labels
- `activity` — empty, viewAll
- `charts` — chart titles, status labels
- `trend` — up, down, same
- `role` — admin, teacher, student

---

## Implementation Sequence

| # | Task | Agent | Files |
|---|------|-------|-------|
| 1 | Save spec documents | orchestrator | 5 |
| 2 | Shared types + interfaces | backend | 10 |
| 3 | Dashboard repository (abstract + concrete) | backend | 2 |
| 4 | GetAdminDashboard handler | backend | 2 |
| 5 | GetTeacherDashboard handler | backend | 2 |
| 6 | GetStudentDashboard handler | backend | 2 |
| 7 | GetRecentActivity handler | backend | 2 |
| 8 | Resolver + module assembly | backend | 2 |
| 9 | shadcn audit + recharts install | frontend | 1 |
| 10 | Feature folder + GraphQL operations | frontend | 1 |
| 11 | Per-role hooks | frontend | 4 |
| 12 | Chart components | frontend | 4 |
| 13 | Shared dashboard components | frontend | 6 |
| 14 | Per-role sections + DashboardPage | frontend | 4 |
| 15 | i18n translations | frontend | 2 |

**Total**: ~36 new files, 2 modified files

---

## Security Verification Checklist

| Test | Expected |
|------|----------|
| Student calls `adminDashboard` | `ForbiddenException` — no data fetched |
| Student calls `teacherDashboard` | `ForbiddenException` — no data fetched |
| Teacher calls `adminDashboard` | `ForbiddenException` — no data fetched |
| Admin calls `studentDashboard` | Returns data (admin has `MANAGE ALL`) |
| Unauthenticated calls any query | `UnauthorizedException` from `JwtAuthGuard` |
| Teacher `recentActivity` | Only activity from teacher's groups + own |
| Student `recentActivity` | Only own activity |
| Admin `recentActivity` | All activity |

---

## Verification

### Backend
1. `pnpm --filter @ceicavs/api dev` — starts without errors
2. Apollo Sandbox as admin: `adminDashboard` returns all fields non-null
3. Apollo Sandbox as teacher: `teacherDashboard` returns all fields non-null
4. Apollo Sandbox as student: `studentDashboard` returns all fields non-null
5. Apollo Sandbox as student: `adminDashboard` → ForbiddenException
6. Apollo Sandbox as teacher: `adminDashboard` → ForbiddenException
7. `recentActivity` returns role-scoped results
8. `pnpm --filter @ceicavs/api typecheck` passes

### Frontend
1. `pnpm --filter @ceicavs/web generate` — codegen produces typed operations
2. `pnpm --filter @ceicavs/web dev` — starts without errors
3. Admin login: `AdminDashboard` renders (4 stats + all activity + 3 charts + 5 actions)
4. Teacher login: `TeacherDashboard` renders (4 stats + scoped activity + 2 charts + 5 actions)
5. Student login: `StudentDashboard` renders (4 stats + own activity + 1 chart + 4 actions)
6. Network tab: each role fires only its own query (no cross-role fields in request)
7. Dark mode + mobile responsive: all components render correctly
8. `pnpm --filter @ceicavs/web typecheck` passes
