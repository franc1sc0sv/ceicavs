import { useQuery } from '@apollo/client/react'
import { GET_RECENT_ACTIVITY } from '../graphql/dashboard.queries'

export function useRecentActivity(limit: number = 10) {
  const { data, loading, error, refetch } = useQuery(GET_RECENT_ACTIVITY, {
    variables: { limit },
  })
  return {
    activities: data?.recentActivity ?? [],
    loading,
    error,
    refetch,
  }
}
