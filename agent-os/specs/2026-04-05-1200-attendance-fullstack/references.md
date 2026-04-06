# References for Attendance (Fullstack)

## Similar Implementations

### Auth Module (Backend Reference)

- **Location**: `apps/api/src/modules/auth/`
- **Relevance**: Complete working example of the CQRS vertical slice pattern in this codebase.
- **Key patterns to borrow**:
  - Module assembly: `auth.module.ts` — how to wire `CqrsModule`, providers, IoC tokens
  - Repository pattern: `auth.repository.abstract.ts` + `auth.repository.ts` — abstract class + concrete Prisma implementation
  - Handler pattern: `commands/login/login.handler.ts` — `BaseCommandHandler`, CASL check, tx usage
  - Query handler: `queries/get-me/get-me.handler.ts` — `BaseQueryHandler`, tx usage
  - Thin resolver: `resolvers/auth.resolver.ts` — dispatch-only pattern with `@CurrentUser()`
  - Interfaces: `interfaces/auth.interfaces.ts` — domain interface definitions

### Pre-built UI Components (Frontend Reference)

- **Location**: `product-plan/sections/attendance/components/`
- **Relevance**: These are the finished, styled UI components to be copied and adapted into the feature folder.
- **Files**:
  - `AttendanceView.tsx` — root component, handles role switching, group list, group detail, student view
  - `GroupCard.tsx` — single group card with RateRing SVG component
  - `RosterRow.tsx` — single student row with segmented status control
  - `index.ts` — barrel (do NOT copy this to `apps/web/src/features/attendance/components/`)
- **Adaptation needed**:
  - Replace hardcoded Spanish strings with `useTranslation()` i18n keys
  - Remove the `index.ts` barrel; import directly from each component file
  - Keep Tailwind classes exactly as-is

### Attendance Type Definitions (Reference)

- **Location**: `product-plan/sections/attendance/types.ts`
- **Relevance**: TypeScript interfaces for all data shapes. Copy to `apps/web/src/features/attendance/types.ts` (frontend) and use as reference for backend domain interfaces.

### Sample Data (Reference)

- **Location**: `product-plan/sections/attendance/sample-data.json`
- **Relevance**: Realistic test data for groups (3ºA Matutino, Club de Robótica, etc.), roster, reports, and student history. Use for integration testing.

### Dashboard i18n (Frontend Reference)

- **Location**: `apps/web/src/i18n/es/dashboard.json` + `apps/web/src/i18n/en/dashboard.json`
- **Relevance**: Shows the i18n JSON structure and key naming conventions (nested keys, Spanish-first).

### Prisma Attendance Models (Database Reference)

- **Location**: `packages/db/prisma/schema.prisma` (lines 75–132)
- **Key facts**:
  - `AttendanceRecord`: `@@unique([userId, groupId, date])` — upsert on this composite key
  - `AttendanceSubmission`: `@@unique([groupId, date])` — one submission per group per day
  - `GroupMembership`: `@@id([userId, groupId])` — composite PK, no soft delete
  - `Group` and `User` have `deletedAt` — always add `where: { deletedAt: null }`
  - AttendanceRecord and AttendanceSubmission have NO `deletedAt`

### CASL Ability Matrix (Authorization Reference)

- **Location**: `packages/shared/src/casl.ts`
- **Attendance permissions** (always use enum values from `@ceicavs/shared` — never magic strings):
  - Admin: `Action.MANAGE` on `Subject.ATTENDANCE_RECORD`, `Subject.ATTENDANCE_SUBMISSION`; `Action.EXPORT` on `Subject.ATTENDANCE_RECORD`
  - Teacher: same as Admin
  - Student: `Action.READ` on `Subject.ATTENDANCE_RECORD` — own records only, enforced inside handler

### Existing Wave 1 Spec (Context)

- **Location**: `agent-os/specs/2026-04-03-1200-wave0-wave1-shell/`
- **Relevance**: Wave 0+1 delivered the project shell. Attendance depends on auth, AppShell, React Router routes, and Apollo Client — all delivered by Wave 1.
