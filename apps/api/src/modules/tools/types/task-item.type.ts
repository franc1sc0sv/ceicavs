import { ObjectType, Field, ID, Int } from '@nestjs/graphql'

@ObjectType()
export class TaskItemType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  text: string

  @Field(() => Boolean)
  completed: boolean

  @Field(() => Int)
  order: number

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
