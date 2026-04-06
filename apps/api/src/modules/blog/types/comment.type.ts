import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { AuthorType } from './author.type'
import { ReactionSummaryType } from './reaction-summary.type'

@ObjectType()
export class CommentType {
  @Field(() => ID)
  id: string

  @Field(() => ID)
  postId: string

  @Field(() => String)
  text: string

  @Field(() => String, { nullable: true })
  gifUrl: string | null

  @Field(() => String, { nullable: true })
  gifAlt: string | null

  @Field(() => Int)
  depth: number

  @Field(() => ID, { nullable: true })
  parentId: string | null

  @Field(() => AuthorType)
  author: AuthorType

  @Field(() => Int, { nullable: true })
  replyCount: number | null

  @Field(() => [ReactionSummaryType])
  reactionSummary: ReactionSummaryType[]

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
