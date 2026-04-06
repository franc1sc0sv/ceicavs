import { Field, ID, ObjectType } from '@nestjs/graphql'
import { AttendanceStatus } from '../enums/attendance-status.enum'

@ObjectType()
export class RosterStudentType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  avatarUrl: string | null

  @Field(() => AttendanceStatus, { nullable: true })
  status: AttendanceStatus | null
}
