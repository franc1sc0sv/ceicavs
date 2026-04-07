import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { DashboardPostsByStatusType } from './dashboard-posts-by-status.type'
import { DashboardUsersByRoleType } from './dashboard-users-by-role.type'
import { AttendanceDayPointType } from './attendance-day-point.type'

@ObjectType()
export class AdminDashboardStatsType {
  @Field(() => Int)
  totalUsers: number

  @Field(() => Int)
  totalGroups: number

  @Field(() => Int)
  publishedPostsThisMonth: number

  @Field(() => Int)
  publishedPostsLastMonth: number

  @Field(() => Float)
  globalAttendanceRateThisWeek: number

  @Field(() => Float)
  globalAttendanceRateLastWeek: number

  @Field(() => DashboardUsersByRoleType)
  usersByRole: DashboardUsersByRoleType

  @Field(() => DashboardPostsByStatusType)
  postsByStatus: DashboardPostsByStatusType

  @Field(() => [AttendanceDayPointType])
  attendanceTrend: AttendanceDayPointType[]
}
