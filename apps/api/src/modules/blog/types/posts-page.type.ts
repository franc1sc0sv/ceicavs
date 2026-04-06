import { Field, ObjectType } from '@nestjs/graphql'
import { PostType } from './post.type'

@ObjectType()
export class PostsPageType {
  @Field(() => [PostType])
  items: PostType[]

  @Field(() => String, { nullable: true })
  nextCursor: string | null
}
