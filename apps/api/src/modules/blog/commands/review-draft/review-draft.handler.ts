import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { IPostRepository } from '../../interfaces/post.repository'
import type { IPostWithRelations } from '../../interfaces/blog.interfaces'
import { DraftReviewedEvent } from '../../events/draft-reviewed.event'
import { PostPublishedEvent } from '../../events/post-published.event'
import { ReviewDraftCommand } from './review-draft.command'

@CommandHandler(ReviewDraftCommand)
export class ReviewDraftHandler extends BaseCommandHandler<ReviewDraftCommand, IPostWithRelations> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly postRepository: IPostRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: ReviewDraftCommand,
    tx: TxClient,
    events: IDomainEvent[],
  ): Promise<IPostWithRelations> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.APPROVE, Subject.POST)) {
      throw new ForbiddenException()
    }

    const post = await this.postRepository.findById(command.postId, tx)

    if (!post) {
      throw new NotFoundException('Post')
    }

    const status = command.data.action === 'approve' ? 'published' : 'rejected'
    const rejectionNote = command.data.action === 'reject' ? command.data.rejectionNote : undefined

    await this.postRepository.updateStatus(command.postId, status, rejectionNote, tx)

    events.push(new DraftReviewedEvent(command.postId, command.data.action, command.userId))

    if (command.data.action === 'approve') {
      events.push(new PostPublishedEvent(command.postId))
    }

    const posts = await this.postRepository.findMany({ authorId: post.authorId }, tx)
    const fullPost = posts.find((p) => p.id === command.postId)

    if (!fullPost) {
      throw new NotFoundException('Post')
    }

    return fullPost
  }
}
