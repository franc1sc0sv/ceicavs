import { graphql } from '@/generated/gql'

export const GET_ADMIN_DASHBOARD = graphql(`
  query GetAdminDashboard {
    adminDashboard {
      totalUsers
      totalGroups
      publishedPostsThisMonth
      publishedPostsLastMonth
      globalAttendanceRateThisWeek
      globalAttendanceRateLastWeek
      usersByRole {
        admin
        teacher
        student
      }
      postsByStatus {
        published
        draft
        rejected
      }
      attendanceTrend {
        date
        rate
      }
    }
  }
`)

export const GET_TEACHER_DASHBOARD = graphql(`
  query GetTeacherDashboard {
    teacherDashboard {
      myGroupCount
      myGroupsTodayRate
      myPostCount
      pendingAttendanceCount
      myGroupAttendanceTrend {
        groupId
        groupName
        points {
          date
          rate
        }
      }
      myPostsByStatus {
        published
        draft
        rejected
      }
    }
  }
`)

export const GET_STUDENT_DASHBOARD = graphql(`
  query GetStudentDashboard {
    studentDashboard {
      myAttendanceRate
      myCurrentStreak
      myDraftCount
      myGroupMembershipCount
      myAttendanceTrend {
        date
        status
      }
    }
  }
`)

export const GET_RECENT_ACTIVITY = graphql(`
  query GetRecentActivity($limit: Int) {
    recentActivity(limit: $limit) {
      id
      type
      description
      actorName
      actorAvatarUrl
      actorRole
      entityId
      entityType
      createdAt
    }
  }
`)
