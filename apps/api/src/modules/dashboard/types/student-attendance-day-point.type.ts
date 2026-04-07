import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StudentAttendanceDayPointType {
  @Field(() => String)
  date: string

  @Field(() => String, { nullable: true })
  status: string | null
}
