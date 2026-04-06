import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { PostStatus } from './post-status.enum'
import { AuthorType } from './author.type'
import { CategoryType } from './category.type'
import { ReactionSummaryType } from './reaction-summary.type'
import { CommentType } from './comment.type'
import { PostImageType } from './post-image.type'

@ObjectType()
export class PostType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  title: string

  @Field(() => String)
  excerpt: string

  @Field(() => String)
  content: string

  @Field(() => PostStatus)
  status: PostStatus

  @Field(() => ID)
  authorId: string

  @Field(() => String, { nullable: true })
  rejectionNote: string | null

  @Field(() => Date, { nullable: true })
  publishedAt: Date | null

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => AuthorType)
  author: AuthorType

  @Field(() => [CategoryType])
  categories: CategoryType[]

  @Field(() => [ReactionSummaryType])
  reactionSummary: ReactionSummaryType[]

  @Field(() => Int)
  commentCount: number

  @Field(() => [CommentType], { nullable: true })
  comments: CommentType[] | null

  @Field(() => [PostImageType], { nullable: true })
  images: PostImageType[] | null
}
