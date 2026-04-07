import { useQuery } from '@apollo/client/react'
import { GET_TEACHER_DASHBOARD } from '../graphql/dashboard.queries'

export function useTeacherDashboard() {
  const { data, loading, error, refetch } = useQuery(GET_TEACHER_DASHBOARD)
  return {
    stats: data?.teacherDashboard ?? null,
    loading,
    error,
    refetch,
  }
}
