import { ObjectType, Field, ID } from '@nestjs/graphql'
import { ToolCategoryType } from './tool-category.type'

@ObjectType()
export class ToolType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  slug: string

  @Field(() => String)
  description: string

  @Field(() => String)
  icon: string

  @Field(() => String)
  color: string

  @Field(() => ToolCategoryType)
  category: ToolCategoryType
}
