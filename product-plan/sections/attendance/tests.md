# Attendance Tests

## Overview

Tests verify that the Attendance section renders the correct view by role (admin/teacher groups list vs. student personal view), that the roster checklist correctly toggles statuses, that submission works only when changes are made, that reports display correctly with period filtering, and that all callbacks fire with the correct arguments.

---

## User Flow Tests

### Flow 1: Admin/Teacher marks attendance for a group

**Success Path**

1. Render `AttendanceView` with `role="teacher"` and a `groups` array containing 3 groups
2. - [ ] Three `GroupCard` components are rendered in a responsive grid
3. - [ ] Each card shows the group name, member count, and a circular attendance rate indicator
4. - [ ] Groups with `todaySubmitted: true` show a checkmark or "Submitted" badge
5. Click the first group card ("Group 7A")
6. - [ ] `onGroupSelect` is called with the group's `id`
7. Re-render with `groupDetail` set for Group 7A with a roster of 5 students (all statuses `null`)
8. - [ ] The group detail view shows the group name ("Group 7A") and today's date in a date picker
9. - [ ] 5 `RosterRow` components are rendered, each showing student name and a segmented control with no option selected
10. - [ ] The "Submit" button is disabled (no changes made yet)
11. Click "Present" on the first student's segmented control
12. - [ ] `onStatusChange` is called with `(studentId, "present")`
13. - [ ] The "Present" segment highlights in green
14. - [ ] The "Submit" button becomes enabled
15. Mark all 5 students with a status and click "Submit"
16. - [ ] `onSubmitAttendance` is called
17. - [ ] A confirmation message is shown (e.g., "Attendance submitted for Group 7A")

**Failure Path**

1. Render the group detail view with an empty `roster` array
2. - [ ] An empty state message is shown (e.g., "No students in this group")
3. - [ ] The "Submit" button is not rendered or is permanently disabled

### Flow 2: Admin/Teacher views and exports attendance reports

**Success Path**

1. Navigate to the "Reports" tab within a group detail view with `reports` data for 5 students
2. - [ ] A summary table is displayed with columns: Student Name, Attendance Rate, Present, Absent, Late, Excused, Total Days
3. - [ ] The period selector shows "Daily", "Weekly", "Monthly" options with the current period highlighted
4. Click "Monthly" in the period selector
5. - [ ] `onPeriodChange` is called with `"monthly"`
6. Click the PDF export button
7. - [ ] `onExport` is called with `"pdf"`
8. Click the Excel export button
9. - [ ] `onExport` is called with `"excel"`

**Failure Path**

1. Render the reports tab with an empty `reports` array
2. - [ ] An empty state message is shown (e.g., "No attendance records yet")
3. - [ ] Export buttons are disabled or hidden

### Flow 3: Student views personal attendance summary

**Success Path**

1. Render `AttendanceView` with `role="student"`, `studentSummary`, and `studentHistory`
2. - [ ] The summary card shows the overall attendance rate (e.g., "94%"), streak with flame icon (e.g., "12 days"), and group count (e.g., "3 groups")
3. - [ ] Below the summary, attendance history records are listed grouped by date
4. - [ ] Each history record shows the group name and a color-coded status badge (Present = green, Absent = red, Late = amber, Excused = slate)
5. - [ ] The groups list and roster views are NOT rendered for students

**Failure Path**

1. Render with `role="student"` and empty `studentHistory` array
2. - [ ] An empty state message is shown (e.g., "No attendance history yet")
3. - [ ] The summary card still renders with the provided summary data

### Flow 4: Admin/Teacher changes the date to view past attendance

**Success Path**

1. Open a group detail view for Group 7A showing today's roster
2. Change the date picker to yesterday's date
3. - [ ] `onDateChange` is called with the selected date string
4. Re-render with the updated `groupDetail` containing yesterday's roster data
5. - [ ] The roster shows yesterday's saved statuses (pre-filled, not null)
6. Click "Back" to return to the groups list
7. - [ ] `onBack` is called

---

## Empty State Tests

- [ ] When `groups` is an empty array, a friendly message is shown (e.g., "No groups assigned yet")
- [ ] When a group's `todayRate` is `null`, the circular indicator shows a dash or "N/A"
- [ ] When `studentHistory` is empty, a message is shown (e.g., "No attendance history yet")
- [ ] When `reports` is empty for a group, the reports tab shows an appropriate empty state

---

## Component Interaction Tests

- [ ] `GroupCard` grid renders 1 column on mobile, 2 on tablet, 3-4 on desktop
- [ ] The segmented control in `RosterRow` highlights only one option at a time
- [ ] Status colors are correct: Present = green, Absent = red, Late = amber, Excused = slate
- [ ] The date picker defaults to today's date
- [ ] The "Submit" button is disabled until at least one status is changed from its original value
- [ ] The circular attendance rate indicator on `GroupCard` shows the percentage visually (e.g., as a ring/arc)
- [ ] Switching between "Roster" and "Reports" tabs within group detail preserves the selected group

---

## Edge Cases

- [ ] A group with 0 members renders an empty roster without errors
- [ ] A group with 50+ students renders a scrollable roster list
- [ ] Changing a status and then changing it back to the original re-disables the "Submit" button
- [ ] Submitting attendance for a date that already has data works as an update (no double-submit error)
- [ ] Student with 0% attendance rate and 0 streak renders correctly
- [ ] Student summary with `overallRate` of exactly 100 displays correctly
- [ ] Very long group names truncate or wrap properly on the `GroupCard`

---

## Accessibility Checks

- [ ] Segmented controls are keyboard-accessible (arrow keys to switch, Enter/Space to select)
- [ ] Each segmented control has a group label identifying the student name
- [ ] Status colors are accompanied by text labels (not color alone)
- [ ] The date picker is keyboard-accessible
- [ ] The circular attendance rate indicator includes a screen reader label (e.g., "92% attendance today")
- [ ] The "Submit" button communicates its disabled state to screen readers
- [ ] Report table has proper `<th>` headers for screen reader navigation

---

## Sample Test Data

```typescript
import type {
  AttendanceGroup,
  RosterStudent,
  StudentReport,
  StudentHistoryRecord,
  StudentSummary,
  GroupDetail,
} from "./types";

const mockGroups: AttendanceGroup[] = [
  { id: "g1", name: "Group 7A", memberCount: 28, todayRate: 92, todaySubmitted: true },
  { id: "g2", name: "Group 8B", memberCount: 25, todayRate: 88, todaySubmitted: false },
  { id: "g3", name: "Group 9C", memberCount: 30, todayRate: null, todaySubmitted: false },
];

const mockRoster: RosterStudent[] = [
  { id: "r1", name: "Maria Fernandez", status: null },
  { id: "r2", name: "Carlos Mendez", avatarUrl: "https://example.com/avatar2.jpg", status: null },
  { id: "r3", name: "Lucia Ramirez", status: null },
  { id: "r4", name: "Jorge Hernandez", status: null },
  { id: "r5", name: "Sofia Garcia", status: null },
];

const mockReports: StudentReport[] = [
  { studentId: "r1", studentName: "Maria Fernandez", attendanceRate: 96, presentCount: 24, absentCount: 1, lateCount: 0, excusedCount: 0, totalDays: 25 },
  { studentId: "r2", studentName: "Carlos Mendez", attendanceRate: 84, presentCount: 21, absentCount: 3, lateCount: 1, excusedCount: 0, totalDays: 25 },
  { studentId: "r3", studentName: "Lucia Ramirez", attendanceRate: 100, presentCount: 25, absentCount: 0, lateCount: 0, excusedCount: 0, totalDays: 25 },
];

const mockGroupDetail: GroupDetail = {
  group: mockGroups[0],
  date: "2026-03-28",
  roster: mockRoster,
  reports: mockReports,
};

const mockStudentSummary: StudentSummary = {
  overallRate: 94,
  currentStreak: 12,
  groupCount: 3,
};

const mockStudentHistory: StudentHistoryRecord[] = [
  { id: "h1", date: "2026-03-28", groupName: "Group 7A", status: "present" },
  { id: "h2", date: "2026-03-28", groupName: "Group 8B", status: "present" },
  { id: "h3", date: "2026-03-27", groupName: "Group 7A", status: "late" },
  { id: "h4", date: "2026-03-27", groupName: "Group 8B", status: "present" },
  { id: "h5", date: "2026-03-26", groupName: "Group 7A", status: "absent" },
];
```
