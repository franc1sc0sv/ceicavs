import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CategoryType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string
}
