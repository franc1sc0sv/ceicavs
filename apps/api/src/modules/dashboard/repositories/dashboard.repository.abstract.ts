import type { RepositoryMethod } from '../../../common/cqrs'
import type {
  IActivityItem,
  IAttendanceDayPoint,
  IAttendanceGroupLine,
  IDashboardPostsByStatus,
  IDashboardUsersByRole,
  IStudentAttendanceDayPoint,
} from '../interfaces/dashboard.interfaces'

export abstract class IDashboardRepository {
  abstract countActiveUsers: RepositoryMethod<[], number>
  abstract countActiveGroups: RepositoryMethod<[], number>
  abstract countPostsByStatusInRange: RepositoryMethod<[from: Date, to: Date], IDashboardPostsByStatus>
  abstract countAllPostsByStatus: RepositoryMethod<[], IDashboardPostsByStatus>
  abstract computeGlobalAttendanceRateInRange: RepositoryMethod<[from: Date, to: Date], number>
  abstract countUsersByRole: RepositoryMethod<[], IDashboardUsersByRole>
  abstract computeGlobalAttendanceTrend: RepositoryMethod<[days: number], IAttendanceDayPoint[]>

  abstract countGroupsForTeacher: RepositoryMethod<[userId: string], number>
  abstract computeTeacherGroupsTodayRate: RepositoryMethod<[userId: string], number>
  abstract countPostsForUser: RepositoryMethod<[userId: string], number>
  abstract countPendingAttendanceForTeacher: RepositoryMethod<[userId: string], number>
  abstract computeTeacherGroupAttendanceTrend: RepositoryMethod<[userId: string, days: number], IAttendanceGroupLine[]>
  abstract countPostsByStatusForUser: RepositoryMethod<[userId: string], IDashboardPostsByStatus>

  abstract computeStudentAttendanceRate: RepositoryMethod<[userId: string], number>
  abstract computeStudentStreak: RepositoryMethod<[userId: string], number>
  abstract countDraftsForUser: RepositoryMethod<[userId: string], number>
  abstract countGroupMemberships: RepositoryMethod<[userId: string], number>
  abstract computeStudentAttendanceTrend: RepositoryMethod<[userId: string, days: number], IStudentAttendanceDayPoint[]>

  abstract findRecentActivityAll: RepositoryMethod<[limit: number], IActivityItem[]>
  abstract findRecentActivityForTeacher: RepositoryMethod<[userId: string, limit: number], IActivityItem[]>
  abstract findRecentActivityForUser: RepositoryMethod<[userId: string, limit: number], IActivityItem[]>
}
