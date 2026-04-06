import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { BlogResolver } from './resolvers/blog.resolver'
import { IPostRepository } from './interfaces/post.repository'
import { ICategoryRepository } from './interfaces/category.repository'
import { IReactionRepository } from './interfaces/reaction.repository'
import { ICommentRepository } from './interfaces/comment.repository'
import { PostRepository } from './repositories/post.repository'
import { CategoryRepository } from './repositories/category.repository'
import { ReactionRepository } from './repositories/reaction.repository'
import { CommentRepository } from './repositories/comment.repository'
import { CreatePostHandler } from './commands/create-post/create-post.handler'
import { UpdatePostHandler } from './commands/update-post/update-post.handler'
import { DeletePostHandler } from './commands/delete-post/delete-post.handler'
import { ReviewDraftHandler } from './commands/review-draft/review-draft.handler'
import { ToggleReactionHandler } from './commands/toggle-reaction/toggle-reaction.handler'
import { AddCommentHandler } from './commands/add-comment/add-comment.handler'
import { UpdateCommentHandler } from './commands/update-comment/update-comment.handler'
import { DeleteCommentHandler } from './commands/delete-comment/delete-comment.handler'
import { CreateCategoryHandler } from './commands/create-category/create-category.handler'
import { UpdateCategoryHandler } from './commands/update-category/update-category.handler'
import { DeleteCategoryHandler } from './commands/delete-category/delete-category.handler'
import { GetPostsHandler } from './queries/get-posts/get-posts.handler'
import { GetPostByIdHandler } from './queries/get-post-by-id/get-post-by-id.handler'
import { GetCategoriesHandler } from './queries/get-categories/get-categories.handler'
import { GetDraftQueueHandler } from './queries/get-draft-queue/get-draft-queue.handler'
import { GetMyDraftsHandler } from './queries/get-my-drafts/get-my-drafts.handler'
import { GetFeedHandler } from './queries/get-feed/get-feed.handler'
import { GetCommentsHandler } from './queries/get-comments/get-comments.handler'
import { GetRepliesHandler } from './queries/get-replies/get-replies.handler'
import { UploadController } from './controllers/upload.controller'

@Module({
  imports: [CqrsModule],
  controllers: [UploadController],
  providers: [
    BlogResolver,
    { provide: IPostRepository, useClass: PostRepository },
    { provide: ICategoryRepository, useClass: CategoryRepository },
    { provide: IReactionRepository, useClass: ReactionRepository },
    { provide: ICommentRepository, useClass: CommentRepository },
    CreatePostHandler,
    UpdatePostHandler,
    DeletePostHandler,
    ReviewDraftHandler,
    ToggleReactionHandler,
    AddCommentHandler,
    UpdateCommentHandler,
    DeleteCommentHandler,
    CreateCategoryHandler,
    UpdateCategoryHandler,
    DeleteCategoryHandler,
    GetPostsHandler,
    GetPostByIdHandler,
    GetCategoriesHandler,
    GetDraftQueueHandler,
    GetMyDraftsHandler,
    GetFeedHandler,
    GetCommentsHandler,
    GetRepliesHandler,
  ],
})
export class BlogModule {}
