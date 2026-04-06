import { Field, ID, ObjectType } from '@nestjs/graphql'
import { AttendanceStatus } from '../enums/attendance-status.enum'

@ObjectType()
export class StudentHistoryRecordType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  date: string

  @Field(() => String)
  groupName: string

  @Field(() => AttendanceStatus)
  status: AttendanceStatus
}
