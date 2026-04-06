import { useMutation } from '@apollo/client/react'
import { RECORD_ATTENDANCE } from '../graphql/attendance.mutations'
import { GET_ATTENDANCE_GROUPS, GET_ATTENDANCE_ROSTER } from '../graphql/attendance.queries'

export function useRecordAttendance() {
  const [recordAttendance, { loading, error }] = useMutation(RECORD_ATTENDANCE, {
    refetchQueries: [GET_ATTENDANCE_GROUPS, GET_ATTENDANCE_ROSTER],
  })

  return { recordAttendance, loading, error }
}
