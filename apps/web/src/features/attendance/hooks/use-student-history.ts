import { useQuery } from '@apollo/client/react'
import { GET_STUDENT_HISTORY } from '../graphql/attendance.queries'

interface StudentHistoryData {
  studentAttendanceHistory: { id: string; date: string; groupName: string; status: string }[]
}

export function useStudentHistory() {
  const { data, loading, error, refetch } = useQuery(GET_STUDENT_HISTORY)
  const typed = data as StudentHistoryData | undefined

  return {
    history: typed?.studentAttendanceHistory ?? [],
    loading,
    error,
    refetch,
  }
}
