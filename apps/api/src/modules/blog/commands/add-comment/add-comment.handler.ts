import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { IPostRepository } from '../../interfaces/post.repository'
import { ICommentRepository } from '../../interfaces/comment.repository'
import type { IComment } from '../../interfaces/blog.interfaces'
import { AddCommentCommand } from './add-comment.command'

@CommandHandler(AddCommentCommand)
export class AddCommentHandler extends BaseCommandHandler<AddCommentCommand, IComment> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly postRepository: IPostRepository,
    private readonly commentRepository: ICommentRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: AddCommentCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<IComment> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.CREATE, Subject.COMMENT)) {
      throw new ForbiddenException()
    }

    const post = await this.postRepository.findById(command.postId, tx)

    if (!post) {
      throw new NotFoundException('Post')
    }

    if (post.status !== 'published') {
      throw new ForbiddenException()
    }

    let parentDepth = -1

    if (command.parentId != null) {
      const parent = await this.commentRepository.findById(command.parentId, tx)

      if (!parent) {
        throw new NotFoundException('Comment')
      }

      parentDepth = parent.depth
    }

    return this.commentRepository.create(
      command.postId,
      command.authorId,
      command.text,
      command.parentId ?? null,
      parentDepth + 1,
      command.gifUrl ?? null,
      command.gifAlt ?? null,
      tx,
    )
  }
}
