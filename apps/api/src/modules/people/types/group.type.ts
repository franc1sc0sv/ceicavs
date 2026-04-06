import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GroupType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  description: string

  @Field(() => String)
  createdBy: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => Int)
  memberCount: number
}
