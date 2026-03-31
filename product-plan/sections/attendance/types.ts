export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type ReportPeriod = 'daily' | 'weekly' | 'monthly'
export type ExportFormat = 'pdf' | 'excel'

/** A group shown in the groups list */
export interface AttendanceGroup {
  id: string
  name: string
  memberCount: number
  /** Today's attendance rate as a percentage (0-100) */
  todayRate: number | null
  /** Whether attendance has been submitted today */
  todaySubmitted: boolean
}

/** A student in the roster checklist */
export interface RosterStudent {
  id: string
  name: string
  avatarUrl?: string
  /** Current status for today — null if not yet marked */
  status: AttendanceStatus | null
}

/** Per-student row in the reports table */
export interface StudentReport {
  studentId: string
  studentName: string
  attendanceRate: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
  totalDays: number
}

/** A single attendance record in the student's personal history */
export interface StudentHistoryRecord {
  id: string
  date: string
  groupName: string
  status: AttendanceStatus
}

/** Student personal attendance summary */
export interface StudentSummary {
  overallRate: number
  currentStreak: number
  groupCount: number
}

/** Group detail data including roster and reports */
export interface GroupDetail {
  group: AttendanceGroup
  date: string
  roster: RosterStudent[]
  reports: StudentReport[]
}

/** Props for the groups list view (admin/teacher) */
export interface AttendanceGroupsProps {
  groups: AttendanceGroup[]
  /** Called when a group card is clicked */
  onGroupSelect?: (groupId: string) => void
}

/** Props for the group detail/roster view */
export interface AttendanceRosterProps {
  groupDetail: GroupDetail
  /** Called when a student's status is changed */
  onStatusChange?: (studentId: string, status: AttendanceStatus) => void
  /** Called when attendance is submitted for the day */
  onSubmit?: () => void
  /** Called when the date is changed */
  onDateChange?: (date: string) => void
  /** Called to go back to groups list */
  onBack?: () => void
}

/** Props for the reports tab within group detail */
export interface AttendanceReportsProps {
  groupName: string
  reports: StudentReport[]
  period: ReportPeriod
  /** Called when the period filter changes */
  onPeriodChange?: (period: ReportPeriod) => void
  /** Called when export is requested */
  onExport?: (format: ExportFormat) => void
  /** Called to go back to groups list */
  onBack?: () => void
}

/** Props for the student personal attendance view */
export interface StudentAttendanceProps {
  summary: StudentSummary
  history: StudentHistoryRecord[]
}

/** Top-level props for the Attendance section */
export interface AttendanceProps {
  role: 'admin' | 'teacher' | 'student'
  /** Groups list for admin/teacher */
  groups?: AttendanceGroup[]
  /** Selected group detail (when viewing a specific group) */
  groupDetail?: GroupDetail
  /** Student personal summary */
  studentSummary?: StudentSummary
  /** Student attendance history */
  studentHistory?: StudentHistoryRecord[]
  /** Current report period filter */
  reportPeriod?: ReportPeriod
  onGroupSelect?: (groupId: string) => void
  onStatusChange?: (studentId: string, status: AttendanceStatus) => void
  onSubmitAttendance?: () => void
  onDateChange?: (date: string) => void
  onPeriodChange?: (period: ReportPeriod) => void
  onExport?: (format: ExportFormat) => void
  onBack?: () => void
}
