import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ReactionSummaryType {
  @Field(() => String)
  emoji: string

  @Field(() => Int)
  count: number

  @Field(() => Boolean)
  userReacted: boolean
}
