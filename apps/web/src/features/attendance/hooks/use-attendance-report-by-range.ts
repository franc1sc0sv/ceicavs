import { useQuery } from '@apollo/client/react'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { GET_ATTENDANCE_REPORT_BY_RANGE } from '../graphql/attendance.queries'

export interface ReportSummary {
  totalStudents: number
  averageRate: number
  totalPresent: number
  totalAbsent: number
  totalLate: number
  totalExcused: number
  totalSessions: number
}

export interface StudentRow {
  studentId: string
  studentName: string
  attendanceRate: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
  totalDays: number
}

export interface AttendanceReportResult {
  groupId: string
  groupName: string
  dateFrom: string
  dateTo: string
  summary: ReportSummary
  students: StudentRow[]
}

interface AttendanceReportByRangeData {
  attendanceReportByRange: AttendanceReportResult
}

interface AttendanceReportByRangeVariables {
  input: {
    groupId: string
    dateFrom: string
    dateTo: string
    studentIds?: string[]
  }
}

interface UseAttendanceReportByRangeParams {
  groupId: string
  dateFrom: string
  dateTo: string
  studentIds?: string[]
  skip?: boolean
}

const typedQuery = GET_ATTENDANCE_REPORT_BY_RANGE as unknown as TypedDocumentNode<
  AttendanceReportByRangeData,
  AttendanceReportByRangeVariables
>

export function useAttendanceReportByRange({
  groupId,
  dateFrom,
  dateTo,
  studentIds,
  skip = false,
}: UseAttendanceReportByRangeParams) {
  const shouldSkip = skip || !groupId

  const { data, loading, error, refetch } = useQuery(typedQuery, {
    variables: { input: { groupId, dateFrom, dateTo, studentIds } },
    skip: shouldSkip,
  })

  return {
    report: data?.attendanceReportByRange ?? null,
    loading,
    error,
    refetch,
  }
}
