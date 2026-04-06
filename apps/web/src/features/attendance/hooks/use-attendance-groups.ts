import { useQuery } from '@apollo/client/react'
import { GET_ATTENDANCE_GROUPS } from '../graphql/attendance.queries'

interface AttendanceGroupsData {
  attendanceGroups: { id: string; name: string; memberCount: number; todayRate: number; todaySubmitted: boolean }[]
}

export function useAttendanceGroups() {
  const { data, loading, error, refetch } = useQuery(GET_ATTENDANCE_GROUPS)
  const typed = data as AttendanceGroupsData | undefined

  return {
    groups: typed?.attendanceGroups ?? [],
    loading,
    error,
    refetch,
  }
}
