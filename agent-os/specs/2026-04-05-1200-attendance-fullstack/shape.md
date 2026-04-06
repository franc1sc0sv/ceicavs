# Attendance — Shaping Notes

## Scope

Full-stack implementation of the Attendance section (Wave 2, Milestone 03).

**Backend** (`feat/03a-attendance-backend`): NestJS attendance module at `apps/api/src/modules/attendance/` — 5 query handlers, 2 command handlers, BullMQ export processor, thin resolver, Prisma+Kysely repository.

**Frontend** (`feat/03b-attendance-frontend`): React attendance feature at `apps/web/src/features/attendance/` — wire pre-built UI components to Apollo Client, implement state management, add i18n translations.

## Decisions

- **Export**: Real PDF/Excel generation via BullMQ job queue. ExportAttendanceCommand enqueues a job and returns `jobId` immediately. Client polls `attendanceExportStatus(jobId)` for status + download URL. Files stored at `/tmp/ceicavs-exports/{jobId}.{ext}`.
- **Redis**: Not yet in the project. Add `redis` service to `docker-compose.yml` + `REDIS_HOST`/`REDIS_PORT` env vars.
- **New API deps**: `@nestjs/bullmq`, `bullmq`, `ioredis`, `pdfkit`, `exceljs`, `@types/pdfkit`.
- **Roster submission model**: Statuses are collected in local React state and submitted as a single `RecordAttendanceCommand` (bulk upsert). No per-status mutations. Re-submission (update) is allowed — `@@unique([userId, groupId, date])` ensures upsert semantics.
- **GetRoster**: Returns GroupMembership rows for the group + LEFT JOIN AttendanceRecord for the given date. Kysely used for this join.
- **GetAttendanceReport**: Aggregates AttendanceRecord counts per student, filtered by date range derived from `period`. Kysely used for aggregation.
- **GetStudentSummary streak**: Computed from consecutive days with at least one `present` record. Raw Kysely query.
- **Role scoping in GetGroups**: Admin → all groups; Teacher → only groups they are a member of (via GroupMembership). CASL enforces this inside the handler, not as a guard.
- **GraphQL contract pre-agreed**: Both agents share the schema defined in `plan.md`. Frontend agent uses this contract to write Apollo operations without waiting for the backend to compile.

## Context

- **Visuals**: Pre-built UI components in `product-plan/sections/attendance/components/` — `AttendanceView.tsx`, `GroupCard.tsx`, `RosterRow.tsx`. These are the design reference and are copied/adapted into the feature folder. ASCII mockups in `visuals/ui-mockups.md`.
- **Side sheet pattern**: Roster and reports open in a shadcn `<Sheet side="right">` (w-[480px]) — the groups list stays visible behind it. This replaces the full-page navigation in the pre-built `AttendanceView`. Required shadcn components: `Sheet`, `Tabs`, `Badge`, `Progress`, `ScrollArea`, `Skeleton`, `Sonner`.
- **References**: `apps/api/src/modules/auth/` — complete reference for CQRS vertical slice pattern.
- **Product alignment**: Milestone 3 of 7 in the MVP roadmap. Admin sees all groups; Teacher sees only own groups; Student sees personal summary + history.
- **Standards applied**: `backend/cqrs-patterns`, `database/prisma-kysely-patterns`, `frontend/architecture-patterns`, `frontend/design-system`.

## Standards Applied

- `backend/cqrs-patterns` — Transaction-first execution, CASL inside handlers, thin resolvers, domain events after commit
- `database/prisma-kysely-patterns` — Prisma for simple queries; Kysely DummyDriver for aggregations/joins
- `frontend/architecture-patterns` — Feature-first folders (pages/, components/, hooks/, graphql/), Apollo vs Context split, four-state rendering, CASL components, named exports
- `frontend/design-system` — Tailwind v4, dark mode via `class`, indigo primary, slate neutrals
