import type { AttendanceStatus } from '@ceicavs/db'
import type { ExportJobStatus } from '../enums/export-job-status.enum'

export type { AttendanceStatus }

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

export interface IAttendanceReportSummary {
  totalStudents: number
  averageRate: number
  totalPresent: number
  totalAbsent: number
  totalLate: number
  totalExcused: number
  totalSessions: number
}

export interface IAttendanceReportResult {
  groupId: string
  groupName: string
  dateFrom: string
  dateTo: string
  summary: IAttendanceReportSummary
  students: IStudentReport[]
}

export interface IExportJobResult {
  jobId: string
}

export interface IExportStatus {
  jobId: string
  status: ExportJobStatus
  downloadUrl: string | null
}
