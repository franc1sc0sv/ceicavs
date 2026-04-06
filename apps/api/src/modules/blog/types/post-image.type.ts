import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PostImageType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  url: string

  @Field(() => String)
  publicId: string

  @Field(() => Int)
  order: number
}
