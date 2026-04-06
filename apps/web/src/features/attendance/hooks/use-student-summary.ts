import { useQuery } from '@apollo/client/react'
import { GET_STUDENT_SUMMARY } from '../graphql/attendance.queries'

interface StudentSummaryData {
  studentAttendanceSummary: { overallRate: number; currentStreak: number; groupCount: number } | null
}

export function useStudentSummary() {
  const { data, loading, error, refetch } = useQuery(GET_STUDENT_SUMMARY)
  const typed = data as StudentSummaryData | undefined

  return {
    summary: typed?.studentAttendanceSummary ?? null,
    loading,
    error,
    refetch,
  }
}
