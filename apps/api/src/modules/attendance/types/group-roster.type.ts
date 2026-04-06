import { Field, ObjectType } from '@nestjs/graphql'
import { AttendanceGroupType } from './attendance-group.type'
import { RosterStudentType } from './roster-student.type'

@ObjectType()
export class GroupRosterType {
  @Field(() => AttendanceGroupType)
  group: AttendanceGroupType

  @Field(() => String)
  date: string

  @Field(() => [RosterStudentType])
  roster: RosterStudentType[]
}
