# CEICAVS — Implementation Plan

## Current Status


| Layer                                      | Status     | Notes                                                               |
| ------------------------------------------ | ---------- | ------------------------------------------------------------------- |
| `packages/db` schema                       | ✅ Done     | All models, enums, Kysely types generated                           |
| `packages/db` migrations                   | ⚠️ Pending | Schema exists, `prisma migrate dev` not run yet                     |
| `apps/api/src/common/`                     | ✅ Done     | CQRS base handlers, DB service, JWT/CASL guards, decorators, events |
| `packages/shared/src/casl.ts`              | ✅ Done     | Full ability matrix for Admin/Teacher/Student                       |
| `apps/web/src/context/ability.context.tsx` | ✅ Done     | AbilityProvider, Can, useAbility                                    |
| `apps/api/src/app.module.ts`               | ⚠️ Partial | Infrastructure registered, no domain modules yet                    |
| `apps/api/src/modules/`                    | ❌ Empty    | No feature modules exist                                            |
| `apps/web/src/features/`                   | ❌ Empty    | No feature folders exist                                            |
| `apps/web/src/App.tsx`                     | ❌ Stub     | No router, layout, or pages                                         |


---

## Execution Waves

### Wave 0 — Database Migration

> Prerequisite for all backend work


| Agent      | Branch             | Scope                                                                        |
| ---------- | ------------------ | ---------------------------------------------------------------------------- |
| `database` | `feat/00-database` | Run `prisma migrate dev --name init`, verify `pnpm -r typecheck` passescheck |


---

### Wave 1 — Shell (2 parallel after Wave 0)

> Prerequisite for all feature sections


| Agent      | Branch                    | Scope                                                                                                          |
| ---------- | ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `backend`  | `feat/01a-shell-backend`  | Auth module (login, refreshToken, me), JWT strategy, stub all 6 domain modules in `app.module.ts`              |
| `frontend` | `feat/01b-shell-frontend` | AppShell layout, sidebar, React Router (all routes declared), Apollo Client, i18n setup, dark mode, login page |


**Key constraint:** `app.module.ts` touched only by shell-backend. All route declarations done only by shell-frontend.

---

### Wave 2 — Feature Sections (12 parallel after Wave 1)

Each section = 2 independent worktrees. Backend owns `apps/api/src/modules/[domain]/`, frontend owns `apps/web/src/features/[section]/`.


| #   | Section          | Backend branch                   | Frontend branch                   |
| --- | ---------------- | -------------------------------- | --------------------------------- |
| 02  | Dashboard        | `feat/02a-dashboard-backend`     | `feat/02b-dashboard-frontend`     |
| 03  | Attendance       | `feat/03a-attendance-backend`    | `feat/03b-attendance-frontend`    |
| 04  | People           | `feat/04a-people-backend`        | `feat/04b-people-frontend`        |
| 05  | Blog             | `feat/05a-blog-backend`          | `feat/05b-blog-frontend`          |
| 06  | Teaching Tools   | `feat/06a-tools-backend`         | `feat/06b-tools-frontend`         |
| 07  | AI Transcription | `feat/07a-transcription-backend` | `feat/07b-transcription-frontend` |


---

## Section Scope Summary

### 02 — Dashboard

- **Backend:** `GetAdminDashboardQuery`, `GetTeacherDashboardQuery`, `GetStudentDashboardQuery` (stats, activity feed, quick actions)
- **Frontend:** Role-switching dashboard, StatCard, ActivityFeed, QuickActions

### 03 — Attendance

- **Backend:** `GetGroupsQuery`, `GetRosterQuery`, `RecordAttendanceCommand` (bulk), `GetAttendanceReportQuery`, `GetStudentAttendanceHistoryQuery`
- **Frontend:** Group selector, roster with status toggles, bulk mark-all, report table, student history view

### 04 — People

- **Backend:** User CRUD + soft-delete, Group CRUD + soft-delete, `AddMemberToGroupCommand`, `RemoveMemberFromGroupCommand`, `AssignRoleCommand`
- **Frontend:** Users tab + Groups tab, create/edit modals, member manager, role assignment

### 05 — Blog

- **Backend:** Post CRUD + publish/draft/approval workflow, Category queries, Reaction commands, Comment CRUD (2-level), draft approval queue (admin)
- **Frontend:** Feed with filters, post detail, rich text editor, emoji reaction bar, threaded comments, draft approval queue

### 06 — Teaching Tools

- **Backend:** `GetToolCategoriesQuery`, `GetToolsQuery` (search + filter), Favorites commands, seed script (15 tools + 4 categories)
- **Frontend:** Tool grid by category, search, category filter, favorite toggle, 15 individual tool pages

### 07 — AI Transcription

- **Backend:** Folder CRUD, Recording CRUD, `StartTranscriptionCommand`, `GetRecordingDetailQuery`, transcription status polling
- **Frontend:** Folder browser, audio recorder (MediaRecorder API), file uploader, recording list, 4-tab result view (Transcripción / Resumen / Acciones / Metadatos)

---

## File Ownership Map


| Worktree                          | Exclusive paths                                                                   |
| --------------------------------- | --------------------------------------------------------------------------------- |
| `feat/00-database`                | `packages/db/prisma/`                                                             |
| `feat/01a-shell-backend`          | `apps/api/src/modules/auth/` · `apps/api/src/app.module.ts`                       |
| `feat/01b-shell-frontend`         | `apps/web/src/` (all except `context/ability.context.tsx`)                        |
| `feat/02a-dashboard-backend`      | `apps/api/src/modules/dashboard/`                                                 |
| `feat/02b-dashboard-frontend`     | `apps/web/src/features/dashboard/` · `apps/web/src/i18n/*/dashboard.json`         |
| `feat/03a-attendance-backend`     | `apps/api/src/modules/attendance/`                                                |
| `feat/03b-attendance-frontend`    | `apps/web/src/features/attendance/` · `apps/web/src/i18n/*/attendance.json`       |
| `feat/04a-people-backend`         | `apps/api/src/modules/people/`                                                    |
| `feat/04b-people-frontend`        | `apps/web/src/features/people/` · `apps/web/src/i18n/*/people.json`               |
| `feat/05a-blog-backend`           | `apps/api/src/modules/blog/`                                                      |
| `feat/05b-blog-frontend`          | `apps/web/src/features/blog/` · `apps/web/src/i18n/*/blog.json`                   |
| `feat/06a-tools-backend`          | `apps/api/src/modules/tools/`                                                     |
| `feat/06b-tools-frontend`         | `apps/web/src/features/tools/` · `apps/web/src/i18n/*/tools.json`                 |
| `feat/07a-transcription-backend`  | `apps/api/src/modules/transcription/`                                             |
| `feat/07b-transcription-frontend` | `apps/web/src/features/transcription/` · `apps/web/src/i18n/*/transcription.json` |


---

## References

- Data shapes: `product-plan/data-shapes/overview.ts`
- Section specs: `product-plan/sections/[section]/README.md`
- Build instructions: `product-plan/instructions/incremental/[NN]-[section].md`
- Existing infrastructure: `apps/api/src/common/`
- CASL matrix: `packages/shared/src/casl.ts`

