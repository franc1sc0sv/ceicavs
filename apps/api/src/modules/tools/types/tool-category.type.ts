import { ObjectType, Field, ID, Int } from '@nestjs/graphql'

@ObjectType()
export class ToolCategoryType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  slug: string

  @Field(() => Int)
  order: number
}
