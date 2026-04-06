import { Field, ObjectType } from '@nestjs/graphql'
import { CommentType } from './comment.type'

@ObjectType()
export class CommentsPageType {
  @Field(() => [CommentType])
  items: CommentType[]

  @Field(() => String, { nullable: true })
  nextCursor: string | null
}
