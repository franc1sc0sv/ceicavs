import { Field, Float, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StudentSummaryType {
  @Field(() => Float)
  overallRate: number

  @Field(() => Int)
  currentStreak: number

  @Field(() => Int)
  groupCount: number
}
