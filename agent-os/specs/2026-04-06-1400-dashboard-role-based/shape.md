# Dashboard Role-Based Redesign — Shaping Notes

## Scope

Full redesign of the Dashboard feature (`apps/web/src/features/dashboard/` + `apps/api/src/modules/dashboard/`) from static placeholder cards to a data-driven, role-scoped dashboard with four sections: **Stats Overview**, **Activity Feed**, **Quick Actions**, and **Charts/Analytics**.

**Current state**: `DashboardPage.tsx` renders hardcoded stat cards (all values are `"—"`) and static quick action buttons based on role. The API module (`dashboard.module.ts`) is an empty shell with zero handlers, queries, or resolvers.

**Target state**: A backend module with **per-role query handlers** that only fetch data the role is authorized to see. A frontend with **per-role GraphQL operations** that request only the fields that role needs. Each role gets a dedicated, strongly-typed dashboard experience with zero over-fetching.

## Decisions

### Security-First Architecture: One Query Per Role

**Problem with single-type approach:** A single `DashboardStats` type with nullable fields means the frontend requests ALL fields (admin + teacher + student) in one query. The backend returns nulls for irrelevant fields, but this is:
- **Over-fetching** — GraphQL request includes fields the role will never use
- **Weak type safety** — all fields are `T | null`, frontend must guess based on role
- **Leaky abstraction** — student sees the _schema_ of admin data even if values are null
- **Single CASL check** — one broad `Action.READ, Subject.ACTIVITY` check gates everything

**Solution: Separate queries per role, each with its own handler and CASL enforcement.**

```
adminDashboard    → AdminDashboardStats    (all fields non-nullable)
teacherDashboard  → TeacherDashboardStats  (all fields non-nullable)
studentDashboard  → StudentDashboardStats  (all fields non-nullable)
recentActivity    → [ActivityItem!]!       (shared, scoped inside handler)
```

**Why this is better:**
1. **Zero over-fetching** — each role's query requests only its own fields
2. **Strong types** — codegen produces `AdminDashboardStats` with `totalUsers: number` (not `number | null`)
3. **Granular CASL** — each handler checks the specific permissions that role needs:
   - Admin handler: `ability.can(Action.MANAGE, Subject.ALL)`
   - Teacher handler: `ability.can(Action.READ, Subject.ATTENDANCE_RECORD)` + `ability.can(Action.READ, Subject.POST)` + `ability.can(Action.READ, Subject.GROUP)`
   - Student handler: `ability.can(Action.READ, Subject.ATTENDANCE_RECORD)` + `ability.can(Action.READ, Subject.POST)`
4. **Follows CQRS** — one handler per operation, not one handler with 3 branches
5. **Schema isolation** — students can't even see admin field names in the schema introspection (they'd need to query `adminDashboard` which would throw `ForbiddenException`)

### Dual-Layer Auth (matching existing pattern)

Following the established pattern (no `@Can()` decorator in use; auth happens inside handlers):

**Layer 1 — Resolver:** `@UseGuards(JwtAuthGuard)` verifies JWT, extracts user
**Layer 2 — Handler:** `defineAbilityFor(user.role)` + granular `ability.can()` checks

Each dashboard handler enforces its own permission set:

| Handler | CASL Checks |
|---------|-------------|
| `GetAdminDashboardHandler` | `ability.can(Action.MANAGE, Subject.ALL)` |
| `GetTeacherDashboardHandler` | `ability.can(Action.READ, Subject.GROUP)`, `ability.can(Action.READ, Subject.ATTENDANCE_RECORD)`, `ability.can(Action.READ, Subject.POST)` |
| `GetStudentDashboardHandler` | `ability.can(Action.READ, Subject.ATTENDANCE_RECORD)`, `ability.can(Action.READ, Subject.POST)` |
| `GetRecentActivityHandler` | `ability.can(Action.READ, Subject.ACTIVITY)` (all roles have this) |

If any check fails → `ForbiddenException`. No data is fetched at all.

### Data Scoping (No Unnecessary Queries)

Each handler only calls repository methods for data that role is authorized to see:

**Admin** — global aggregations (all users, all groups, all posts, all attendance):
- `countActiveUsers(tx)` — Subject.USER
- `countActiveGroups(tx)` — Subject.GROUP
- `countPostsByStatusInRange(from, to, tx)` — Subject.POST
- `computeGlobalAttendanceRateInRange(from, to, tx)` — Subject.ATTENDANCE_RECORD
- `countUsersByRole(tx)` — Subject.USER
- `countAllPostsByStatus(tx)` — Subject.POST
- `computeGlobalAttendanceTrend(7, tx)` — Subject.ATTENDANCE_RECORD

**Teacher** — scoped to teacher's groups and own posts:
- `countGroupsForTeacher(userId, tx)` — Subject.GROUP (only groups they manage)
- `computeTeacherGroupsTodayRate(userId, tx)` — Subject.ATTENDANCE_RECORD (only their groups)
- `countPostsForUser(userId, tx)` — Subject.POST (only their posts)
- `countPendingAttendanceForTeacher(userId, tx)` — Subject.ATTENDANCE_SUBMISSION (their groups)
- `computeTeacherGroupAttendanceTrend(userId, 7, tx)` — Subject.ATTENDANCE_RECORD (their groups)
- `countPostsByStatusForUser(userId, tx)` — Subject.POST (their posts)

**Student** — scoped to own data only:
- `computeStudentAttendanceRate(userId, tx)` — Subject.ATTENDANCE_RECORD (own records)
- `computeStudentStreak(userId, tx)` — Subject.ATTENDANCE_RECORD (own records)
- `countDraftsForUser(userId, tx)` — Subject.POST (own drafts)
- `countGroupMemberships(userId, tx)` — Subject.GROUP (own memberships)
- `computeStudentAttendanceTrend(userId, 7, tx)` — Subject.ATTENDANCE_RECORD (own records)

### Activity Feed (shared query, scoped inside handler)

One `recentActivity(limit)` query because all roles have `Action.READ, Subject.ACTIVITY`. But the handler scopes data:
- **Admin**: `findRecentActivityAll(limit, tx)` — all activity
- **Teacher**: `findRecentActivityForTeacher(userId, limit, tx)` — activity in their groups + own
- **Student**: `findRecentActivityForUser(userId, limit, tx)` — own activity only

### Frontend: Role-Specific Hooks

```typescript
// Admin dashboard
const { stats } = useAdminDashboard()     // calls GET_ADMIN_DASHBOARD
// stats.totalUsers is number, not number | null

// Teacher dashboard  
const { stats } = useTeacherDashboard()   // calls GET_TEACHER_DASHBOARD
// stats.myGroupCount is number, not number | null

// Student dashboard
const { stats } = useStudentDashboard()   // calls GET_STUDENT_DASHBOARD
// stats.myAttendanceRate is number, not number | null
```

`DashboardPage.tsx` reads `user.role` from auth context and renders the correct role-specific section — each calling only its own hook.

### Other Decisions

- **No new Prisma models** — Activity model already exists. All stats are aggregations from existing tables.
- **recharts for charts** — ~200KB acceptable, dashboard is lazy-loaded.
- **shadcn MCP server** — all frontend component discovery/installation via shadcn MCP tools.

## Role-by-Role Dashboard Matrix

### ADMIN Dashboard

| Section | Content |
|---------|---------|
| **Stats Cards** | 1. Total active users (count) → `/people` 2. Total active groups (count) → `/people` 3. Published posts this month (count + vs last month trend) → `/blog` 4. Attendance rate this week (% + vs last week trend) → `/attendance` |
| **Activity Feed** | All activity records, most recent first, limit 10 |
| **Quick Actions** | 1. Create user (`Action.CREATE, Subject.USER`) 2. Create group (`Action.CREATE, Subject.GROUP`) 3. Create post (`Action.PUBLISH, Subject.POST`) 4. Review drafts (`Action.APPROVE, Subject.POST`) 5. New recording (`Action.TRANSCRIBE, Subject.RECORDING`) |
| **Charts** | 1. Attendance trend (line, 7 days, global) 2. Posts by status (donut) 3. Users by role (bar) |

### TEACHER Dashboard

| Section | Content |
|---------|---------|
| **Stats Cards** | 1. My groups (count) → `/people` 2. Attendance rate today (%) → `/attendance` 3. My posts (count) → `/blog` 4. Pending attendance (groups not submitted today) → `/attendance` |
| **Activity Feed** | Activity in teacher's groups + own actions, limit 10 |
| **Quick Actions** | 1. Take attendance (`Action.CREATE, Subject.ATTENDANCE_RECORD`) 2. Create post (`Action.CREATE, Subject.POST`) 3. Review drafts (`Action.APPROVE, Subject.POST`) 4. New recording (`Action.TRANSCRIBE, Subject.RECORDING`) 5. View tools → `/tools` |
| **Charts** | 1. Attendance per group (multi-line, 7 days) 2. My posts by status (donut) |

### STUDENT Dashboard

| Section | Content |
|---------|---------|
| **Stats Cards** | 1. My attendance rate (%) → `/attendance` 2. Current streak (days) → `/attendance` 3. My drafts (count) → `/blog/drafts` 4. Groups I belong to (count) → `/attendance` |
| **Activity Feed** | Own activity only, limit 10 |
| **Quick Actions** | 1. View attendance → `/attendance` 2. Write post (`Action.CREATE, Subject.POST`) 3. View blog → `/blog` 4. View tools → `/tools` |
| **Charts** | 1. My attendance (bar, 7 days, colored by status) |

## Context

- **Visuals:** None
- **References:** Existing attendance, blog, people modules as data sources. Auth module's `GetMeHandler` as canonical CQRS pattern.
- **Product alignment:** Dashboard is Milestone 02 in the roadmap.

## Standards Applied

- **backend/cqrs-patterns** — Transaction-first handlers, CASL inside handlers, thin resolvers, one handler per operation
- **database/prisma-kysely-patterns** — Prisma for simple counts, Kysely for aggregations/trends
- **frontend/architecture-patterns** — Feature-first folders, four-state rendering, CASL via `<Can>`, named exports
- **frontend/design-system** — Tailwind v4 tokens, dark mode, responsive grid
