export interface IDashboardPostsByStatus {
  published: number
  draft: number
  rejected: number
}

export interface IDashboardUsersByRole {
  admin: number
  teacher: number
  student: number
}

export interface IAttendanceDayPoint {
  date: string
  rate: number
}

export interface IAttendanceGroupLine {
  groupId: string
  groupName: string
  points: IAttendanceDayPoint[]
}

export interface IStudentAttendanceDayPoint {
  date: string
  status: string | null
}

export interface IAdminDashboardStats {
  totalUsers: number
  totalGroups: number
  publishedPostsThisMonth: number
  publishedPostsLastMonth: number
  globalAttendanceRateThisWeek: number
  globalAttendanceRateLastWeek: number
  usersByRole: IDashboardUsersByRole
  postsByStatus: IDashboardPostsByStatus
  attendanceTrend: IAttendanceDayPoint[]
}

export interface ITeacherDashboardStats {
  myGroupCount: number
  myGroupsTodayRate: number
  myPostCount: number
  pendingAttendanceCount: number
  myGroupAttendanceTrend: IAttendanceGroupLine[]
  myPostsByStatus: IDashboardPostsByStatus
}

export interface IStudentDashboardStats {
  myAttendanceRate: number
  myCurrentStreak: number
  myDraftCount: number
  myGroupMembershipCount: number
  myAttendanceTrend: IStudentAttendanceDayPoint[]
}

export interface IActivityItem {
  id: string
  type: string
  description: string
  actorName: string
  actorAvatarUrl: string | null
  actorRole: string
  entityId: string | null
  entityType: string | null
  createdAt: Date
}
