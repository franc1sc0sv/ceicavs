import { useQuery } from '@apollo/client/react'
import { GET_STUDENT_DASHBOARD } from '../graphql/dashboard.queries'

export function useStudentDashboard() {
  const { data, loading, error, refetch } = useQuery(GET_STUDENT_DASHBOARD)
  return {
    stats: data?.studentDashboard ?? null,
    loading,
    error,
    refetch,
  }
}
