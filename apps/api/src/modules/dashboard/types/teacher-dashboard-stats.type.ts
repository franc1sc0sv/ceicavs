import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { DashboardPostsByStatusType } from './dashboard-posts-by-status.type'
import { AttendanceGroupLineType } from './attendance-group-line.type'

@ObjectType()
export class TeacherDashboardStatsType {
  @Field(() => Int)
  myGroupCount: number

  @Field(() => Float)
  myGroupsTodayRate: number

  @Field(() => Int)
  myPostCount: number

  @Field(() => Int)
  pendingAttendanceCount: number

  @Field(() => [AttendanceGroupLineType])
  myGroupAttendanceTrend: AttendanceGroupLineType[]

  @Field(() => DashboardPostsByStatusType)
  myPostsByStatus: DashboardPostsByStatusType
}
