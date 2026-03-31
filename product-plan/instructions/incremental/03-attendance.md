# Milestone 3: Attendance

Provide alongside: `product-overview.md`

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Goal

Build a group-based attendance tracking system. Admins and teachers view their groups, open a roster checklist to mark students, submit attendance, and generate exportable reports. Students see a personal attendance summary with their streak and history across all groups.

## Overview

The Attendance section has three views depending on role and navigation state: (1) a groups list showing all assigned groups with today's rate, (2) a group detail view with roster and reports tabs, and (3) a student personal view with summary stats and chronological history. Admins see all groups system-wide; teachers see only their own groups.

## Key Functionality

- **Groups list (admin/teacher)**: card grid with group name, member count, circular attendance rate ring for today, and whether today's attendance has been submitted
- **Group detail — Roster tab**: header with group name and date picker, scrollable roster checklist where each student row shows name, avatar/initials, and a segmented control (Present / Absent / Late / Excused) color-coded green/red/amber/slate
- **Group detail — Reports tab**: summary table with per-student attendance percentages and absence counts, period filter (daily/weekly/monthly), PDF and Excel export buttons
- **Submit attendance**: button at bottom of roster, disabled until at least one status is changed, shows confirmation on submit
- **Date navigation**: date picker allows viewing or editing attendance for past days (one roster per day per group)
- **Student personal view**: summary card (overall rate, current streak with flame icon, group count), chronological history list grouped by date showing group name and status badge
- **Admin sees all groups; Teacher sees only their own groups**

## Components Provided

| File | Description |
|------|-------------|
| `sections/attendance/components/AttendanceView.tsx` | Root component handling groups list, detail, and student view |
| `sections/attendance/components/GroupCard.tsx` | Single group card with name, count, and rate ring |
| `sections/attendance/components/RosterRow.tsx` | Single student row with segmented status control |
| `sections/attendance/components/index.ts` | Barrel exports |

## Props Reference

### AttendanceView (top-level)

| Prop | Type | Description |
|------|------|-------------|
| `role` | `'admin' \| 'teacher' \| 'student'` | Determines groups list vs. personal view |
| `groups` | `AttendanceGroup[]` | Groups for the groups list (admin/teacher) |
| `groupDetail` | `GroupDetail` | Selected group detail data (roster + reports) |
| `studentSummary` | `StudentSummary` | Student personal summary stats |
| `studentHistory` | `StudentHistoryRecord[]` | Student attendance history records |
| `reportPeriod` | `ReportPeriod` | Current report filter period |
| `onGroupSelect` | `(groupId: string) => void` | Called when a group card is clicked |
| `onStatusChange` | `(studentId: string, status: AttendanceStatus) => void` | Called when a student's status toggle changes |
| `onSubmitAttendance` | `() => void` | Called when attendance is submitted |
| `onDateChange` | `(date: string) => void` | Called when the date picker changes |
| `onPeriodChange` | `(period: ReportPeriod) => void` | Called when report period filter changes |
| `onExport` | `(format: ExportFormat) => void` | Called when PDF or Excel export is requested |
| `onBack` | `() => void` | Called to return from detail to groups list |

### AttendanceGroup data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Group identifier |
| `name` | `string` | Group display name |
| `memberCount` | `number` | Number of members |
| `todayRate` | `number \| null` | Today's attendance percentage (0-100), null if no data |
| `todaySubmitted` | `boolean` | Whether today's attendance has been submitted |

### RosterStudent data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Student identifier |
| `name` | `string` | Student display name |
| `avatarUrl` | `string` | Optional avatar URL |
| `status` | `AttendanceStatus \| null` | Current status (present/absent/late/excused) or null if unmarked |

### StudentReport data shape

| Field | Type | Description |
|-------|------|-------------|
| `studentId` | `string` | Student identifier |
| `studentName` | `string` | Student display name |
| `attendanceRate` | `number` | Attendance percentage |
| `presentCount` | `number` | Days present |
| `absentCount` | `number` | Days absent |
| `lateCount` | `number` | Days late |
| `excusedCount` | `number` | Days excused |
| `totalDays` | `number` | Total tracked days |

### Key enums

- `AttendanceStatus`: `'present' | 'absent' | 'late' | 'excused'`
- `ReportPeriod`: `'daily' | 'weekly' | 'monthly'`
- `ExportFormat`: `'pdf' | 'excel'`

## Expected User Flows

### Flow 1: Teacher marks attendance
1. Teacher opens Attendance and sees their groups as cards, each showing group name, member count, and today's attendance rate ring
2. Teacher clicks a group card to open the group detail view with the roster for today's date
3. Teacher marks each student as Present, Absent, Late, or Excused using the segmented controls
4. Teacher clicks "Submit Attendance" — confirmation is shown, the `onSubmitAttendance` callback fires

### Flow 2: Admin generates reports
1. Admin opens a group's detail view and switches to the Reports tab
2. Admin sees a summary table with per-student attendance rates and absence counts
3. Admin changes the period filter from daily to monthly — the table updates via `onPeriodChange`
4. Admin clicks the PDF export button — `onExport('pdf')` fires

### Flow 3: Student views personal attendance
1. Student opens Attendance and sees their personal summary card: overall rate, current streak (flame icon), and number of groups
2. Student scrolls down to see a chronological list of their attendance records across all groups, each showing date, group name, and status badge (color-coded)

## Empty States

- **No groups (admin/teacher)**: "No hay grupos asignados" / "No groups assigned" with guidance to create one in People
- **No attendance records for a group**: "No hay registros de asistencia para este grupo" / "No attendance records for this group yet"
- **No student history**: "Aun no tienes registros de asistencia" / "You don't have any attendance records yet"
- **No data for selected date**: Show the roster with all statuses as null (unmarked)

## Testing

Refer to `sections/attendance/tests.md` for detailed test specs covering:
- Groups list renders with correct data per role
- Roster status changes fire callbacks
- Submit button disabled/enabled states
- Date picker navigation
- Report period filtering
- Export callbacks
- Student personal view displays correctly

## Files to Reference

| File | Purpose |
|------|---------|
| `product/sections/attendance/spec.md` | Full section specification |
| `product/sections/attendance/types.ts` | TypeScript interfaces |
| `product/sections/attendance/data.json` | Sample data |
| `sections/attendance/components/AttendanceView.tsx` | Root attendance component |
| `sections/attendance/components/GroupCard.tsx` | Group card component |
| `sections/attendance/components/RosterRow.tsx` | Roster row component |

## Done When

- [ ] Attendance section renders inside the AppShell
- [ ] Admin sees all groups; Teacher sees only their own groups
- [ ] Group cards display name, member count, and circular attendance rate ring
- [ ] Clicking a group card opens the group detail view
- [ ] Roster shows student names with segmented status controls (Present/Absent/Late/Excused)
- [ ] Status controls are color-coded: green (present), red (absent), amber (late), slate (excused)
- [ ] Submit button is disabled until at least one status is changed
- [ ] Submitting attendance fires `onSubmitAttendance` and shows confirmation
- [ ] Date picker allows navigating to past days
- [ ] Reports tab shows per-student breakdown table
- [ ] Period filter (daily/weekly/monthly) updates reports
- [ ] PDF and Excel export buttons fire `onExport` with the correct format
- [ ] Back button returns from detail to groups list
- [ ] Student sees personal summary with overall rate, streak (flame icon), and group count
- [ ] Student sees chronological history with date, group name, and status badge
- [ ] Empty states display appropriately for each scenario
