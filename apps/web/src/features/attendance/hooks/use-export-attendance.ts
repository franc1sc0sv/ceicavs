import { useMutation } from '@apollo/client/react'
import { EXPORT_ATTENDANCE } from '../graphql/attendance.mutations'

interface ExportAttendanceData {
  exportAttendance: { jobId: string } | null
}

export function useExportAttendance() {
  const [exportAttendance, { loading, error, data }] = useMutation(EXPORT_ATTENDANCE)
  const typed = data as ExportAttendanceData | undefined

  return {
    exportAttendance,
    loading,
    error,
    jobId: typed?.exportAttendance?.jobId ?? null,
  }
}
