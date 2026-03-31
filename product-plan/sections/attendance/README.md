# Attendance

## Overview

Group-based attendance tracking system where admins and teachers view their assigned groups, open a roster checklist to mark each student as present, absent, late, or excused, and generate exportable reports with basic statistics. Students see a personal summary with their overall attendance rate, streak, and history across all their groups.

## Components Provided

- `AttendanceView` — Top-level container that switches between admin/teacher groups list view and student personal view based on the `role` prop. Manages navigation between groups list, group detail (roster + reports tabs), and student summary.
- `GroupCard` — A card displaying a group's name, member count, and circular attendance rate indicator for today. Shown in the groups list grid.
- `RosterRow` — A single student row in the roster checklist with student name, avatar/initials, and a segmented control for status (Present / Absent / Late / Excused) with color-coded options (green / red / amber / slate).

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onGroupSelect(groupId: string)` | Admin/teacher clicks a group card to view its detail |
| `onStatusChange(studentId: string, status: AttendanceStatus)` | A student's attendance status is toggled on the roster |
| `onSubmitAttendance()` | Admin/teacher clicks the "Submit" button after marking the roster |
| `onDateChange(date: string)` | Admin/teacher changes the date picker to view/edit a different day's attendance |
| `onPeriodChange(period: ReportPeriod)` | Admin/teacher changes the report period filter (daily/weekly/monthly) |
| `onExport(format: ExportFormat)` | Admin/teacher clicks the PDF or Excel export button in reports |
| `onBack()` | User navigates back from group detail to the groups list |

## Data Shapes

**`AttendanceGroup`** — A group card: `id`, `name`, `memberCount`, `todayRate` (0-100 or null), `todaySubmitted`.

**`RosterStudent`** — A student in the checklist: `id`, `name`, `avatarUrl?`, `status` (present/absent/late/excused or null).

**`StudentReport`** — Per-student report row: `studentId`, `studentName`, `attendanceRate`, `presentCount`, `absentCount`, `lateCount`, `excusedCount`, `totalDays`.

**`StudentHistoryRecord`** — Student personal history entry: `id`, `date`, `groupName`, `status`.

**`StudentSummary`** — Student personal summary: `overallRate`, `currentStreak`, `groupCount`.

**`GroupDetail`** — Full group data: `group`, `date`, `roster`, `reports`.

**`AttendanceProps`** — Top-level: `role`, `groups?`, `groupDetail?`, `studentSummary?`, `studentHistory?`, `reportPeriod?`, plus all callbacks.

See `types.ts` for full interface definitions.
