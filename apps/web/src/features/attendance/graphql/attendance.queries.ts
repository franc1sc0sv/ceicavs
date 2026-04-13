import { graphql } from '@/generated/gql'

export const GET_ATTENDANCE_GROUPS = graphql(`
  query GetAttendanceGroups {
    attendanceGroups {
      id
      name
      memberCount
      todayRate
      todaySubmitted
    }
  }
`)

export const GET_ATTENDANCE_ROSTER = graphql(`
  query GetAttendanceRoster($groupId: String!, $date: String!) {
    attendanceRoster(groupId: $groupId, date: $date) {
      group {
        id
        name
        memberCount
        todayRate
        todaySubmitted
      }
      date
      roster {
        id
        name
        avatarUrl
        status
      }
    }
  }
`)

export const GET_ATTENDANCE_REPORT = graphql(`
  query GetAttendanceReport($groupId: String!, $period: ReportPeriod!, $date: String) {
    attendanceReport(groupId: $groupId, period: $period, date: $date) {
      studentId
      studentName
      attendanceRate
      presentCount
      absentCount
      lateCount
      excusedCount
      totalDays
    }
  }
`)

export const GET_STUDENT_HISTORY = graphql(`
  query GetStudentAttendanceHistory {
    studentAttendanceHistory {
      id
      date
      groupName
      status
    }
  }
`)

export const GET_STUDENT_SUMMARY = graphql(`
  query GetStudentAttendanceSummary {
    studentAttendanceSummary {
      overallRate
      currentStreak
      groupCount
    }
  }
`)

export const GET_EXPORT_STATUS = graphql(`
  query GetExportStatus($jobId: String!) {
    attendanceExportStatus(jobId: $jobId) {
      jobId
      status
      downloadUrl
    }
  }
`)

export const GET_ATTENDANCE_REPORT_BY_RANGE = graphql(`
  query AttendanceReportByRange($input: AttendanceReportByRangeInput!) {
    attendanceReportByRange(input: $input) {
      groupId
      groupName
      dateFrom
      dateTo
      summary {
        totalStudents
        averageRate
        totalPresent
        totalAbsent
        totalLate
        totalExcused
        totalSessions
      }
      students {
        studentId
        studentName
        attendanceRate
        presentCount
        absentCount
        lateCount
        excusedCount
        totalDays
      }
    }
  }
`)
