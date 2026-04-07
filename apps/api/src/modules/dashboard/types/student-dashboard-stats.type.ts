import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { StudentAttendanceDayPointType } from './student-attendance-day-point.type'

@ObjectType()
export class StudentDashboardStatsType {
  @Field(() => Float)
  myAttendanceRate: number

  @Field(() => Int)
  myCurrentStreak: number

  @Field(() => Int)
  myDraftCount: number

  @Field(() => Int)
  myGroupMembershipCount: number

  @Field(() => [StudentAttendanceDayPointType])
  myAttendanceTrend: StudentAttendanceDayPointType[]
}
