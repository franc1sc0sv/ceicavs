# Attendance — Full-Stack Plan

## Parallel Execution Strategy

This spec runs in worktrees alongside people-management and blog-fullstack. Three files will conflict across all three specs and must be handled via sequential merge after all branches complete:

1. **`apps/api/src/app.module.ts`** — each spec registers its module. Attendance also adds `BullModule.forRoot`.
2. **`apps/web/src/router/routes.tsx`** — each spec adds route entries.
3. **`apps/web/src/i18n/index.ts`** — each spec registers a namespace.

**Rule**: Do NOT modify these files in the worktree. Instead, leave a `TODO` comment or note in the PR description. A post-merge integration step will add all three modules/routes/namespaces at once.

### GraphQL Codegen

Backend and frontend run in separate worktrees. The frontend won't have the backend's updated `schema.gql` until merge. Workflow:
1. **Frontend branch**: write operations using `graphql()` from `@/generated/gql` against the agreed schema contract below. Operations won't be type-checked until codegen runs.
2. **Post-merge**: run `pnpm --filter @ceicavs/web generate` to regenerate typed operations in `src/generated/`.
3. **Do NOT** use `gql` from `@apollo/client` — always use the generated `graphql()` function.

## Context

Wave 2 implementation of the Attendance section (Milestone 03). Pre-built UI components exist in `product-plan/sections/attendance/components/`. The backend module stub exists at `apps/api/src/modules/attendance/attendance.module.ts`. The frontend page stub exists at `apps/web/src/features/attendance/AttendancePage.tsx`. Database models (`AttendanceRecord`, `AttendanceSubmission`, `GroupMembership`) are already in the Prisma schema and migrated.

**Execution model**: Two parallel agents — `backend` on `feat/03a-attendance-backend`, `frontend` on `feat/03b-attendance-frontend`. Both agents agree on the GraphQL schema contract defined below so they can work independently.

---

## GraphQL Schema Contract (Pre-agreed)

```graphql
enum AttendanceStatus { present, absent, late, excused }
enum ReportPeriod { daily, weekly, monthly }
enum ExportFormat { pdf, excel }
enum ExportJobStatus { pending, processing, done, failed }

type AttendanceGroup {
  id: ID!
  name: String!
  memberCount: Int!
  todayRate: Float
  todaySubmitted: Boolean!
}

type RosterStudent {
  id: ID!
  name: String!
  avatarUrl: String
  status: AttendanceStatus
}

type GroupRoster {
  group: AttendanceGroup!
  date: String!
  roster: [RosterStudent!]!
}

type StudentReport {
  studentId: ID!
  studentName: String!
  attendanceRate: Float!
  presentCount: Int!
  absentCount: Int!
  lateCount: Int!
  excusedCount: Int!
  totalDays: Int!
}

type StudentHistoryRecord {
  id: ID!
  date: String!
  groupName: String!
  status: AttendanceStatus!
}

type StudentSummary {
  overallRate: Float!
  currentStreak: Int!
  groupCount: Int!
}

type ExportJob { jobId: String! }

type ExportStatus {
  jobId: String!
  status: ExportJobStatus!
  downloadUrl: String
}

input AttendanceRecordItem {
  studentId: ID!
  status: AttendanceStatus!
}

input RecordAttendanceInput {
  groupId: ID!
  date: String!
  records: [AttendanceRecordItem!]!
}

input ExportAttendanceInput {
  groupId: ID!
  period: ReportPeriod!
  format: ExportFormat!
}

type Query {
  attendanceGroups: [AttendanceGroup!]!
  attendanceRoster(groupId: ID!, date: String!): GroupRoster!
  attendanceReport(groupId: ID!, period: ReportPeriod!): [StudentReport!]!
  studentAttendanceHistory: [StudentHistoryRecord!]!
  studentAttendanceSummary: StudentSummary!
  attendanceExportStatus(jobId: String!): ExportStatus!
}

type Mutation {
  recordAttendance(input: RecordAttendanceInput!): Boolean!
  exportAttendance(input: ExportAttendanceInput!): ExportJob!
}
```

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/2026-04-05-1200-attendance-fullstack/` with `plan.md`, `shape.md`, `standards.md`, `references.md`.

---

## Backend Tasks (agent: `backend`, branch: `feat/03a-attendance-backend`)

### Task 2: Infrastructure — Redis + Dependencies

**Files modified**:
- `docker-compose.yml` — add `redis` service (image: `redis:7-alpine`, port `6379:6379`)
- `apps/api/package.json` — add deps: `@nestjs/bullmq`, `bullmq`, `pdfkit`, `exceljs`; add dev dep: `@types/pdfkit`

**Env vars** (document in `.env.example`):
- `REDIS_HOST=localhost`
- `REDIS_PORT=6379`

### Task 3: Domain Interfaces + GraphQL Types

**Files to create** in `apps/api/src/modules/attendance/`:

`interfaces/attendance.interfaces.ts`:
```typescript
export interface IAttendanceGroup {
  id: string
  name: string
  memberCount: number
  todayRate: number | null
  todaySubmitted: boolean
}

export interface IRosterStudent {
  id: string
  name: string
  avatarUrl: string | null
  status: AttendanceStatus | null
}

export interface IGroupRoster {
  group: IAttendanceGroup
  date: string
  roster: IRosterStudent[]
}

export interface IStudentReport {
  studentId: string
  studentName: string
  attendanceRate: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
  totalDays: number
}

export interface IStudentHistoryRecord {
  id: string
  date: string
  groupName: string
  status: AttendanceStatus
}

export interface IStudentSummary {
  overallRate: number
  currentStreak: number
  groupCount: number
}

export interface IRecordAttendanceItem {
  studentId: string
  status: AttendanceStatus
}

export interface IExportJobResult {
  jobId: string
}

export interface IExportStatus {
  jobId: string
  status: ExportJobStatus
  downloadUrl: string | null
}
```

**GraphQL types** (`types/`):
- `attendance-group.type.ts` — `@ObjectType() AttendanceGroupType`
- `roster-student.type.ts` — `@ObjectType() RosterStudentType`
- `group-roster.type.ts` — `@ObjectType() GroupRosterType`
- `student-report.type.ts` — `@ObjectType() StudentReportType`
- `student-summary.type.ts` — `@ObjectType() StudentSummaryType`
- `student-history-record.type.ts` — `@ObjectType() StudentHistoryRecordType`
- `export-job.type.ts` — `@ObjectType() ExportJobType`
- `export-status.type.ts` — `@ObjectType() ExportStatusType`
- `record-attendance.input.ts` — `@InputType() RecordAttendanceInput` + `AttendanceRecordItemInput`
- `export-attendance.input.ts` — `@InputType() ExportAttendanceInput`

**Enums** (register with `registerEnumType`):
- `AttendanceStatus` (present, absent, late, excused)
- `ReportPeriod` (daily, weekly, monthly)
- `ExportFormat` (pdf, excel)
- `ExportJobStatus` (pending, processing, done, failed)

### Task 4: Attendance Repository

`interfaces/attendance.interfaces.ts` — add abstract repository contract.

`repositories/attendance.repository.abstract.ts`:
```typescript
export abstract class IAttendanceRepository {
  abstract findGroupsForAdmin: RepositoryMethod<[], IAttendanceGroup[]>
  abstract findGroupsForTeacher: RepositoryMethod<[userId: string], IAttendanceGroup[]>
  abstract findRoster: RepositoryMethod<[groupId: string, date: string], IRosterStudent[]>
  abstract findAttendanceReport: RepositoryMethod<[groupId: string, period: ReportPeriod, dateRange: { from: Date; to: Date }], IStudentReport[]>
  abstract findStudentHistory: RepositoryMethod<[userId: string], IStudentHistoryRecord[]>
  abstract findStudentSummary: RepositoryMethod<[userId: string], IStudentSummary>
  abstract upsertAttendanceRecords: RepositoryMethod<[groupId: string, date: string, records: IRecordAttendanceItem[]], void>
  abstract upsertSubmission: RepositoryMethod<[groupId: string, submittedBy: string, date: string], void>
  abstract findReportDataForExport: RepositoryMethod<[groupId: string, period: ReportPeriod, dateRange: { from: Date; to: Date }], IStudentReport[]>
}
```

`repositories/attendance.repository.ts` — concrete Prisma + Kysely implementation:
- `findGroupsForAdmin`: `tx.group.findMany({ where: { deletedAt: null }, include: { _count: { select: { memberships: true } }, attendanceSubmissions: { where: { date: today } } } })`
- `findGroupsForTeacher`: same but filtered by `memberships: { some: { userId } }`
- `findRoster`: Kysely join — `group_memberships LEFT JOIN attendance_records ON (userId, groupId, date)`
- `findAttendanceReport`: Kysely aggregation — `COUNT(*) FILTER (WHERE status = 'present')`, grouped by `user_id`
- `findStudentHistory`: `tx.attendanceRecord.findMany({ where: { userId, group: { deletedAt: null } }, include: { group: { select: { name: true } } }, orderBy: { date: 'desc' } })`
- `findStudentSummary`: Kysely for streak calculation (consecutive days with present record); group count from GroupMembership
- `upsertAttendanceRecords`: loop `tx.attendanceRecord.upsert({ where: { userId_groupId_date: ... }, create: ..., update: ... })`
- `upsertSubmission`: `tx.attendanceSubmission.upsert({ where: { groupId_date: ... }, create: ..., update: ... })`

### Task 5: Query Handlers (5)

Each handler in `queries/[name]/[name].handler.ts` + `.query.ts`:

**get-groups**: Admin → `findGroupsForAdmin(tx)`; Teacher → `findGroupsForTeacher(user.id, tx)`. CASL: `ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)`.

**get-roster**: CASL admin/teacher — `ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)`. Call `findRoster(query.groupId, query.date, tx)`. Also check if submission exists for that date to set `todaySubmitted`.

**get-attendance-report**: CASL admin/teacher — `ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)`. Compute `dateRange` from `period` (daily = today, weekly = last 7 days, monthly = last 30 days). Call `findAttendanceReport(groupId, period, dateRange, tx)`.

**get-student-history**: CASL student — `ability.can(Action.READ, Subject.ATTENDANCE_RECORD)`. Call `findStudentHistory(user.id, tx)`.

**get-student-summary**: CASL student — `ability.can(Action.READ, Subject.ATTENDANCE_RECORD)`. Call `findStudentSummary(user.id, tx)`.

### Task 6: Command Handlers (2)

**record-attendance** (`commands/record-attendance/`):
- CASL: `ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)`
- Call `upsertAttendanceRecords(groupId, date, records, tx)`
- Call `upsertSubmission(groupId, user.id, date, tx)`
- Push `AttendanceSubmittedEvent` to events array
- Return `true`

**export-attendance** (`commands/export-attendance/`):
- CASL: `ability.can(Action.EXPORT, Subject.ATTENDANCE_RECORD)`
- Enqueue BullMQ job: `this.exportQueue.add('export', { groupId, period, format, requestedBy: user.id })`
- Return `{ jobId: job.id }`

### Task 7: BullMQ Export Processor

`jobs/export-attendance.processor.ts`:
```typescript
@Processor('attendance-export')
export class ExportAttendanceProcessor extends WorkerHost {
  async process(job: Job<ExportJobData>): Promise<void> {
    // 1. Fetch report data via repository (use $transaction)
    // 2. If format === 'pdf': generate with pdfkit, stream to /tmp/ceicavs-exports/{jobId}.pdf
    // 3. If format === 'excel': generate with exceljs, write to /tmp/ceicavs-exports/{jobId}.xlsx
    // 4. job.updateProgress(100)
  }
}
```

`queries/get-export-status/get-export-status.handler.ts`:
- Inject `@InjectQueue('attendance-export') queue: Queue`
- `const job = await this.queue.getJob(query.jobId)`
- Map BullMQ job state to `ExportJobStatus` enum
- If `done`: `downloadUrl = /exports/${jobId}`

**REST endpoint** for file download: add `AttendanceController` with `@Get('/exports/:jobId')` that serves the file from `/tmp/ceicavs-exports/`. Register controller in `attendance.module.ts`.

### Task 8: Attendance Resolver

`resolvers/attendance.resolver.ts` — all operations `@UseGuards(JwtAuthGuard)`:

```typescript
@Query(() => [AttendanceGroupType]) attendanceGroups(@CurrentUser() user) → GetGroupsQuery
@Query(() => GroupRosterType) attendanceRoster(@Args groupId, date, @CurrentUser() user) → GetRosterQuery
@Query(() => [StudentReportType]) attendanceReport(@Args groupId, period, @CurrentUser() user) → GetAttendanceReportQuery
@Query(() => [StudentHistoryRecordType]) studentAttendanceHistory(@CurrentUser() user) → GetStudentHistoryQuery
@Query(() => StudentSummaryType) studentAttendanceSummary(@CurrentUser() user) → GetStudentSummaryQuery
@Query(() => ExportStatusType) attendanceExportStatus(@Args jobId, @CurrentUser() user) → GetExportStatusQuery
@Mutation(() => Boolean) recordAttendance(@Args input, @CurrentUser() user) → RecordAttendanceCommand
@Mutation(() => ExportJobType) exportAttendance(@Args input, @CurrentUser() user) → ExportAttendanceCommand
```

### Task 9: Module Assembly

`attendance.module.ts`:
```typescript
@Module({
  imports: [
    CqrsModule,
    BullModule.registerQueue({ name: 'attendance-export' }),
  ],
  providers: [
    AttendanceResolver,
    { provide: IAttendanceRepository, useClass: AttendanceRepository },
    GetGroupsHandler, GetRosterHandler, GetAttendanceReportHandler,
    GetStudentHistoryHandler, GetStudentSummaryHandler, GetExportStatusHandler,
    RecordAttendanceHandler, ExportAttendanceHandler,
    ExportAttendanceProcessor,
  ],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
```

Register `BullModule.forRoot({ connection: { host: process.env.REDIS_HOST, port: +process.env.REDIS_PORT } })` in `app.module.ts` (global). Import `AttendanceModule` in `app.module.ts`.

---

## Frontend Tasks (agent: `frontend`, branch: `feat/03b-attendance-frontend`)

### Task 10: Feature Folder Structure + Types

Create `apps/web/src/features/attendance/`:
```
attendance/
├── attendance-page.tsx      ← replace stub (lazy-loaded default export)
├── components/
│   ├── attendance-view.tsx  ← copy + adapt (add i18n)
│   ├── group-card.tsx       ← copy as-is
│   └── roster-row.tsx       ← copy as-is
├── hooks/
│   ├── useAttendanceGroups.ts
│   ├── useRoster.ts
│   ├── useAttendanceReport.ts
│   ├── useStudentHistory.ts
│   ├── useStudentSummary.ts
│   ├── useRecordAttendance.ts
│   └── useExportAttendance.ts
└── graphql/
    ├── attendance.queries.ts
    └── attendance.mutations.ts
```

Do NOT copy `types.ts` from product-plan. Frontend types come from GraphQL codegen. If interim types are needed before codegen is set up, co-locate them with the component that uses them.

### Task 11: GraphQL Operations

`graphql/attendance.queries.ts`:
```typescript
import { graphql } from '@/generated/gql'

export const GET_ATTENDANCE_GROUPS = graphql(`
  query GetAttendanceGroups {
    attendanceGroups {
      id name memberCount todayRate todaySubmitted
    }
  }
`)

export const GET_ATTENDANCE_ROSTER = graphql(`
  query GetAttendanceRoster($groupId: ID!, $date: String!) {
    attendanceRoster(groupId: $groupId, date: $date) {
      group { id name memberCount todayRate todaySubmitted }
      date
      roster { id name avatarUrl status }
    }
  }
`)

export const GET_ATTENDANCE_REPORT = graphql(`
  query GetAttendanceReport($groupId: ID!, $period: ReportPeriod!) {
    attendanceReport(groupId: $groupId, period: $period) {
      studentId studentName attendanceRate presentCount absentCount lateCount excusedCount totalDays
    }
  }
`)

export const GET_STUDENT_HISTORY = graphql(`
  query GetStudentAttendanceHistory {
    studentAttendanceHistory { id date groupName status }
  }
`)

export const GET_STUDENT_SUMMARY = graphql(`
  query GetStudentAttendanceSummary {
    studentAttendanceSummary { overallRate currentStreak groupCount }
  }
`)

export const GET_EXPORT_STATUS = graphql(`
  query GetExportStatus($jobId: String!) {
    attendanceExportStatus(jobId: $jobId) { jobId status downloadUrl }
  }
`)
```

`graphql/attendance.mutations.ts`:
```typescript
import { graphql } from '@/generated/gql'

export const RECORD_ATTENDANCE = graphql(`
  mutation RecordAttendance($input: RecordAttendanceInput!) {
    recordAttendance(input: $input)
  }
`)

export const EXPORT_ATTENDANCE = graphql(`
  mutation ExportAttendance($input: ExportAttendanceInput!) {
    exportAttendance(input: $input) { jobId }
  }
`)
```

### Task 12: Hooks

`hooks/useAttendanceGroups.ts`:
```typescript
export function useAttendanceGroups() {
  const { data, loading, error, refetch } = useQuery<...>(GET_ATTENDANCE_GROUPS)
  return { groups: data?.attendanceGroups ?? [], loading, error, refetch }
}
```

`hooks/useRoster.ts`:
```typescript
export function useRoster(groupId: string, date: string) {
  const { data, loading, error, refetch } = useQuery<...>(GET_ATTENDANCE_ROSTER, {
    variables: { groupId, date },
    skip: !groupId,
  })
  return { groupRoster: data?.attendanceRoster ?? null, loading, error, refetch }
}
```

`hooks/useRecordAttendance.ts`:
```typescript
export function useRecordAttendance() {
  const [mutate, { loading, error }] = useMutation(RECORD_ATTENDANCE)
  const recordAttendance = (input: RecordAttendanceInput) => mutate({ variables: { input } })
  return { recordAttendance, loading, error }
}
```

Similarly: `useAttendanceReport`, `useStudentHistory`, `useStudentSummary`, `useExportAttendance`.

### Task 13: AttendancePage — State + Side Sheet Wiring

**Architecture**: Groups grid is the main content. Clicking a group opens a shadcn `<Sheet side="right">` (w-[480px] sm, full-width mobile) containing roster + reports. The groups list stays visible behind the sheet.

See `visuals/ui-mockups.md` for full ASCII mockups of all views.

**shadcn components to install**: `sheet`, `tabs`, `badge`, `progress`, `scroll-area`, `skeleton`, `sonner`

`AttendancePage.tsx` (replace stub, default export):

**State:**
```typescript
const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
const [sheetOpen, setSheetOpen] = useState(false)
const [selectedDate, setSelectedDate] = useState<string>(todayISO())
const [rosterChanges, setRosterChanges] = useState<Record<string, AttendanceStatus>>({})
const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('monthly')
const [activeTab, setActiveTab] = useState<'roster' | 'reports'>('roster')
```

**Data:**
- Role from `useAbility()` / auth context
- If student: `useStudentSummary()` + `useStudentHistory()`
- If admin/teacher: `useAttendanceGroups()` always; `useRoster(selectedGroupId!, selectedDate)` (skip when no group)

**Page structure (admin/teacher):**
```tsx
<>
  {/* Main content — groups grid */}
  <GroupsGrid groups={...} onGroupSelect={handleGroupSelect} />

  {/* Side sheet — opens on group click */}
  <Sheet open={sheetOpen} onOpenChange={handleSheetClose}>
    <SheetContent side="right" className="w-full sm:w-[480px] flex flex-col p-0">
      <SheetHeader className="px-5 pt-5 pb-0">
        <div className="flex items-center justify-between">
          <SheetTitle>{selectedGroup?.name}</SheetTitle>
          <Input type="date" value={selectedDate} onChange={...} />
        </div>
      </SheetHeader>

      <Tabs value={activeTab} onValueChange={...} className="flex-1 flex flex-col">
        <TabsList className="mx-5 mt-3">
          <TabsTrigger value="roster">{t('tabs.roster')}</TabsTrigger>
          <TabsTrigger value="reports">{t('tabs.reports')}</TabsTrigger>
        </TabsList>

        <TabsContent value="roster" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            {/* Roster rows */}
          </ScrollArea>
          <SheetFooter className="px-5 py-4 border-t">
            <Button onClick={handleSubmit} disabled={!hasChanges} className="w-full">
              {submissionExists ? t('actions.update') : t('actions.submit')}
            </Button>
          </SheetFooter>
        </TabsContent>

        <TabsContent value="reports">
          {/* Period filter + export buttons + table */}
        </TabsContent>
      </Tabs>
    </SheetContent>
  </Sheet>
</>
```

**Callback wiring:**
- `onGroupSelect(groupId)` → `setSelectedGroupId(groupId)` + `setSheetOpen(true)` + `setRosterChanges({})`
- `onStatusChange(studentId, status)` → `setRosterChanges(prev => ({ ...prev, [studentId]: status }))`
- `onSubmitAttendance()` → call `recordAttendance(...)`, then `groupsRefetch()` + `rosterRefetch()` + `setRosterChanges({})`
- `onDateChange(date)` → `setSelectedDate(date)` + `setRosterChanges({})`
- Sheet `onOpenChange(false)` → `setSheetOpen(false)` + `setSelectedGroupId(null)` + `setRosterChanges({})`
- `onPeriodChange(period)` → `setReportPeriod(period)`
- `onExport(format)` → call `exportAttendance(...)` → start polling `GET_EXPORT_STATUS` every 2s via `setInterval` → on `done`: clear interval + show Sonner toast with download link

**Four-state rendering (groups)**:
```typescript
if (groupsLoading) return <GroupsGridSkeleton />  // grid of skeleton cards
if (groupsError) return <ErrorState error={groupsError} onRetry={refetch} />
if (!groups.length) return <EmptyState message={t('attendance.empty.noGroups')} />
```

**Roster merged state** (inside sheet):
- `mergedRoster = roster.map(s => ({ ...s, status: rosterChanges[s.id] ?? s.status }))`

### Task 14: i18n Translations

`apps/web/src/i18n/es/attendance.json`:
```json
{
  "title": "Asistencia",
  "subtitle": "Selecciona un grupo para tomar la lista del día",
  "tabs": { "roster": "Lista del día", "reports": "Reportes" },
  "status": { "present": "Presente", "absent": "Ausente", "late": "Tarde", "excused": "Justificado" },
  "period": { "daily": "Diario", "weekly": "Semanal", "monthly": "Mensual" },
  "actions": {
    "submit": "Enviar asistencia",
    "update": "Actualizar asistencia",
    "exportPdf": "PDF",
    "exportExcel": "Excel"
  },
  "empty": {
    "noGroups": "No tienes grupos asignados todavía",
    "noStudents": "No hay alumnos en este grupo",
    "noHistory": "Sin registros de asistencia todavía",
    "noReports": "Sin datos de reportes para este período"
  },
  "pending": "{{count}} grupo(s) sin asistencia registrada hoy",
  "student": {
    "title": "Mi Asistencia",
    "streakLabel": "días seguidos",
    "groupsLabel": "grupos",
    "generalLabel": "General",
    "historyLabel": "Historial"
  },
  "report": {
    "student": "Alumno",
    "attendance": "Asistencia"
  },
  "export": {
    "queued": "Exportación en proceso",
    "ready": "Listo para descargar",
    "failed": "Error en la exportación"
  },
  "back": "Asistencia",
  "dateLabel": "Fecha:"
}
```

`apps/web/src/i18n/en/attendance.json` — English equivalents.

Register `attendance` namespace in `apps/web/src/i18n/index.ts`.

---

## Verification

### Backend
1. `docker compose up -d` — start Postgres + Redis
2. `pnpm --filter @ceicavs/api dev` — API starts without errors
3. Open Apollo Sandbox (`http://localhost:4000/graphql`)
4. Login → get JWT → set Authorization header
5. Query `attendanceGroups` as admin → returns all groups
6. Query `attendanceGroups` as teacher → returns only their groups
7. Mutation `recordAttendance` → returns `true`; subsequent `attendanceRoster` shows saved statuses
8. Mutation `exportAttendance` with format `pdf` → returns `jobId`
9. Poll `attendanceExportStatus(jobId)` → transitions to `done` + returns `downloadUrl`
10. `GET /exports/{jobId}` → serves the PDF file
11. `pnpm --filter @ceicavs/api typecheck` → passes with 0 errors

### Frontend
1. After backend merge: `pnpm --filter @ceicavs/web generate` — regenerates typed operations from `schema.gql`
2. `pnpm --filter @ceicavs/web dev`
2. Log in as admin → navigate to `/attendance` → groups grid renders
3. Click a group → roster renders with segmented controls
4. Mark students → Submit → success state shown; re-open same date → statuses pre-filled
5. Reports tab → table renders with period filter
6. Log in as teacher → only their groups shown
7. Log in as student → summary card + history renders
8. Export PDF/Excel → job queued → polling → file downloads
9. Dark mode toggle → all components render correctly
10. `pnpm --filter @ceicavs/web typecheck` → passes with 0 errors
