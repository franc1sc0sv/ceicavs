import { useQuery } from '@apollo/client/react'
import { GET_ATTENDANCE_ROSTER } from '../graphql/attendance.queries'

interface UseRosterParams {
  groupId: string | null
  date: string
}

interface AttendanceRosterData {
  attendanceRoster: {
    group: { id: string; name: string; memberCount: number; todayRate: number; todaySubmitted: boolean }
    date: string
    roster: { id: string; name: string; avatarUrl: string | null; status: string | null }[]
  } | null
}

export function useRoster({ groupId, date }: UseRosterParams) {
  const { data, loading, error, refetch } = useQuery(GET_ATTENDANCE_ROSTER, {
    variables: { groupId: groupId ?? '', date },
    skip: !groupId,
    fetchPolicy: 'cache-and-network',
  })
  const typed = data as AttendanceRosterData | undefined

  return {
    rosterData: typed?.attendanceRoster ?? null,
    loading,
    error,
    refetch,
  }
}
