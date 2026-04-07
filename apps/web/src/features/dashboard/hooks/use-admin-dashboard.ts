import { useQuery } from '@apollo/client/react'
import { GET_ADMIN_DASHBOARD } from '../graphql/dashboard.queries'

export function useAdminDashboard() {
  const { data, loading, error, refetch } = useQuery(GET_ADMIN_DASHBOARD)
  return {
    stats: data?.adminDashboard ?? null,
    loading,
    error,
    refetch,
  }
}
