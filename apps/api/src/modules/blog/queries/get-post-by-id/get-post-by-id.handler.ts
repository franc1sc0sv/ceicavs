import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { IPostRepository } from '../../interfaces/post.repository'
import { IReactionRepository } from '../../interfaces/reaction.repository'
import { ICommentRepository } from '../../interfaces/comment.repository'
import type { IPostWithRelations } from '../../interfaces/blog.interfaces'
import { GetPostByIdQuery } from './get-post-by-id.query'

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdHandler extends BaseQueryHandler<GetPostByIdQuery, IPostWithRelations> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly postRepository: IPostRepository,
    private readonly reactionRepository: IReactionRepository,
    private readonly commentRepository: ICommentRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetPostByIdQuery, tx: TxClient): Promise<IPostWithRelations> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.POST)) {
      throw new ForbiddenException()
    }

    const posts = await this.postRepository.findMany({ authorId: undefined, status: undefined, categoryId: undefined, search: undefined }, tx)
    const fullPost = posts.find((p) => p.id === query.postId)

    if (!fullPost) {
      throw new NotFoundException('Post')
    }

    const isStudent = query.role === UserRole.STUDENT
    const isOwnPost = fullPost.authorId === query.userId

    if (isStudent && fullPost.status !== 'published' && !isOwnPost) {
      throw new ForbiddenException()
    }

    const reactionSummary = await this.reactionRepository.findSummaryByPost(
      query.postId,
      query.userId,
      tx,
    )

    const comments = await this.commentRepository.findByPost(query.postId, tx)

    return { ...fullPost, reactionSummary, comments }
  }
}
