import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'
import type { IJwtUser } from '../../../common/types'
import { PostType } from '../types/post.type'
import { PostsPageType } from '../types/posts-page.type'
import { CommentsPageType } from '../types/comments-page.type'
import { CategoryType } from '../types/category.type'
import { ReactionSummaryType } from '../types/reaction-summary.type'
import { CommentType } from '../types/comment.type'
import { PostFiltersInput } from '../types/post-filters.input'
import { CreatePostInput } from '../commands/create-post/create-post.input'
import { UpdatePostInput } from '../commands/update-post/update-post.input'
import { ReviewDraftInput } from '../commands/review-draft/review-draft.input'
import { AddCommentInput } from '../commands/add-comment/add-comment.input'
import { CreatePostCommand } from '../commands/create-post/create-post.command'
import { UpdatePostCommand } from '../commands/update-post/update-post.command'
import { DeletePostCommand } from '../commands/delete-post/delete-post.command'
import { ReviewDraftCommand } from '../commands/review-draft/review-draft.command'
import { ToggleReactionCommand } from '../commands/toggle-reaction/toggle-reaction.command'
import { AddCommentCommand } from '../commands/add-comment/add-comment.command'
import { UpdateCommentCommand } from '../commands/update-comment/update-comment.command'
import { DeleteCommentCommand } from '../commands/delete-comment/delete-comment.command'
import { CreateCategoryCommand } from '../commands/create-category/create-category.command'
import { UpdateCategoryCommand } from '../commands/update-category/update-category.command'
import { DeleteCategoryCommand } from '../commands/delete-category/delete-category.command'
import { GetPostsQuery } from '../queries/get-posts/get-posts.query'
import { GetPostByIdQuery } from '../queries/get-post-by-id/get-post-by-id.query'
import { GetCategoriesQuery } from '../queries/get-categories/get-categories.query'
import { GetDraftQueueQuery } from '../queries/get-draft-queue/get-draft-queue.query'
import { GetMyDraftsQuery } from '../queries/get-my-drafts/get-my-drafts.query'
import { GetFeedQuery } from '../queries/get-feed/get-feed.query'
import { GetCommentsQuery } from '../queries/get-comments/get-comments.query'
import { GetRepliesQuery } from '../queries/get-replies/get-replies.query'
import type { IPostWithRelations, ICategory, IReactionSummary, IComment } from '../interfaces/blog.interfaces'
import type { IPostsPage } from '../interfaces/post.repository'
import type { ICommentsPage } from '../interfaces/comment.repository'

@Resolver()
@UseGuards(JwtAuthGuard)
export class BlogResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [PostType])
  async posts(
    @CurrentUser() user: IJwtUser,
    @Args('filters', { type: () => PostFiltersInput, nullable: true }) filters?: PostFiltersInput,
  ): Promise<IPostWithRelations[]> {
    return this.queryBus.execute<GetPostsQuery, IPostWithRelations[]>(
      new GetPostsQuery(filters ?? {}, user.id, user.role),
    )
  }

  @Query(() => PostType)
  async post(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<IPostWithRelations> {
    return this.queryBus.execute<GetPostByIdQuery, IPostWithRelations>(
      new GetPostByIdQuery(id, user.id, user.role),
    )
  }

  @Query(() => [CategoryType])
  async categories(@CurrentUser() user: IJwtUser): Promise<ICategory[]> {
    return this.queryBus.execute<GetCategoriesQuery, ICategory[]>(
      new GetCategoriesQuery(user.role),
    )
  }

  @Query(() => [PostType])
  async draftQueue(@CurrentUser() user: IJwtUser): Promise<IPostWithRelations[]> {
    return this.queryBus.execute<GetDraftQueueQuery, IPostWithRelations[]>(
      new GetDraftQueueQuery(user.role),
    )
  }

  @Query(() => [PostType])
  async myDrafts(@CurrentUser() user: IJwtUser): Promise<IPostWithRelations[]> {
    return this.queryBus.execute<GetMyDraftsQuery, IPostWithRelations[]>(
      new GetMyDraftsQuery(user.id, user.role),
    )
  }

  @Query(() => PostsPageType)
  async feed(
    @CurrentUser() user: IJwtUser,
    @Args('filters', { type: () => PostFiltersInput, nullable: true }) filters?: PostFiltersInput,
    @Args('cursor', { type: () => String, nullable: true }) cursor?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<IPostsPage> {
    return this.queryBus.execute<GetFeedQuery, IPostsPage>(
      new GetFeedQuery(filters ?? {}, cursor, limit ?? 12, user.id, user.role),
    )
  }

  @Query(() => CommentsPageType)
  async comments(
    @CurrentUser() user: IJwtUser,
    @Args('postId', { type: () => ID }) postId: string,
    @Args('cursor', { type: () => String, nullable: true }) cursor?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<ICommentsPage> {
    return this.queryBus.execute<GetCommentsQuery, ICommentsPage>(
      new GetCommentsQuery(postId, cursor, limit ?? 10, user.id, user.role),
    )
  }

  @Query(() => CommentsPageType)
  async replies(
    @CurrentUser() user: IJwtUser,
    @Args('parentId', { type: () => ID }) parentId: string,
    @Args('cursor', { type: () => String, nullable: true }) cursor?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<ICommentsPage> {
    return this.queryBus.execute<GetRepliesQuery, ICommentsPage>(
      new GetRepliesQuery(parentId, cursor, limit ?? 5, user.id, user.role),
    )
  }

  @Mutation(() => PostType)
  async createPost(
    @CurrentUser() user: IJwtUser,
    @Args('input', { type: () => CreatePostInput }) input: CreatePostInput,
  ): Promise<IPostWithRelations> {
    return this.commandBus.execute<CreatePostCommand, IPostWithRelations>(
      new CreatePostCommand(
        {
          title: input.title,
          excerpt: input.excerpt,
          content: input.content,
          categoryIds: input.categoryIds,
          publish: input.publish,
          images: input.images,
        },
        user.id,
        user.role,
      ),
    )
  }

  @Mutation(() => PostType)
  async updatePost(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdatePostInput }) input: UpdatePostInput,
  ): Promise<IPostWithRelations> {
    return this.commandBus.execute<UpdatePostCommand, IPostWithRelations>(
      new UpdatePostCommand(
        id,
        {
          title: input.title,
          excerpt: input.excerpt,
          content: input.content,
          categoryIds: input.categoryIds,
          images: input.images,
        },
        user.id,
        user.role,
      ),
    )
  }

  @Mutation(() => Boolean)
  async deletePost(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.commandBus.execute<DeletePostCommand, boolean>(
      new DeletePostCommand(id, user.id, user.role),
    )
  }

  @Mutation(() => PostType)
  async reviewDraft(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => ReviewDraftInput }) input: ReviewDraftInput,
  ): Promise<IPostWithRelations> {
    return this.commandBus.execute<ReviewDraftCommand, IPostWithRelations>(
      new ReviewDraftCommand(id, { action: input.action, rejectionNote: input.rejectionNote }, user.id, user.role),
    )
  }

  @Mutation(() => [ReactionSummaryType])
  async toggleReaction(
    @CurrentUser() user: IJwtUser,
    @Args('postId', { type: () => ID, nullable: true }) postId?: string,
    @Args('commentId', { type: () => ID, nullable: true }) commentId?: string,
    @Args('emoji', { type: () => String, nullable: true }) emoji?: string,
  ): Promise<IReactionSummary[]> {
    return this.commandBus.execute<ToggleReactionCommand, IReactionSummary[]>(
      new ToggleReactionCommand(postId ?? null, commentId ?? null, user.id, emoji ?? '', user.role),
    )
  }

  @Mutation(() => CommentType)
  async addComment(
    @CurrentUser() user: IJwtUser,
    @Args('input', { type: () => AddCommentInput }) input: AddCommentInput,
  ): Promise<IComment> {
    return this.commandBus.execute<AddCommentCommand, IComment>(
      new AddCommentCommand(
        input.postId,
        user.id,
        input.text,
        user.role,
        input.parentId,
        input.gifUrl,
        input.gifAlt,
      ),
    )
  }

  @Mutation(() => CommentType)
  async updateComment(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('text', { type: () => String }) text: string,
  ): Promise<IComment> {
    return this.commandBus.execute<UpdateCommentCommand, IComment>(
      new UpdateCommentCommand(id, text, user.id, user.role),
    )
  }

  @Mutation(() => Boolean)
  async deleteComment(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.commandBus.execute<DeleteCommentCommand, boolean>(
      new DeleteCommentCommand(id, user.id, user.role),
    )
  }

  @Mutation(() => CategoryType)
  async createCategory(
    @CurrentUser() user: IJwtUser,
    @Args('name', { type: () => String }) name: string,
  ): Promise<ICategory> {
    return this.commandBus.execute<CreateCategoryCommand, ICategory>(
      new CreateCategoryCommand(name, user.role),
    )
  }

  @Mutation(() => CategoryType)
  async updateCategory(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('name', { type: () => String }) name: string,
  ): Promise<ICategory> {
    return this.commandBus.execute<UpdateCategoryCommand, ICategory>(
      new UpdateCategoryCommand(id, name, user.role),
    )
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.commandBus.execute<DeleteCategoryCommand, boolean>(
      new DeleteCategoryCommand(id, user.role),
    )
  }
}
