import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AttendanceDayPointType {
  @Field(() => String)
  date: string

  @Field(() => Float)
  rate: number
}
