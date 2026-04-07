import { Field, ID, ObjectType } from '@nestjs/graphql'
import { AttendanceDayPointType } from './attendance-day-point.type'

@ObjectType()
export class AttendanceGroupLineType {
  @Field(() => ID)
  groupId: string

  @Field(() => String)
  groupName: string

  @Field(() => [AttendanceDayPointType])
  points: AttendanceDayPointType[]
}
