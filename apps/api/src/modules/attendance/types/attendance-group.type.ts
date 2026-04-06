import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AttendanceGroupType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => Int)
  memberCount: number

  @Field(() => Float, { nullable: true })
  todayRate: number | null

  @Field(() => Boolean)
  todaySubmitted: boolean
}
