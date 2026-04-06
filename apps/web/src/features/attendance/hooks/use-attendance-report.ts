import { useQuery } from '@apollo/client/react'
import type { ReportPeriod } from '@/generated/graphql'
import { GET_ATTENDANCE_REPORT } from '../graphql/attendance.queries'

interface UseAttendanceReportParams {
  groupId: string | null
  period: ReportPeriod
}

interface AttendanceReportData {
  attendanceReport: { studentId: string; studentName: string; attendanceRate: number; presentCount: number; absentCount: number; lateCount: number; excusedCount: number; totalDays: number }[]
}

export function useAttendanceReport({ groupId, period }: UseAttendanceReportParams) {
  const { data, loading, error, refetch } = useQuery(GET_ATTENDANCE_REPORT, {
    variables: { groupId: groupId ?? '', period },
    skip: !groupId,
  })
  const typed = data as AttendanceReportData | undefined

  return {
    reports: typed?.attendanceReport ?? [],
    loading,
    error,
    refetch,
  }
}
