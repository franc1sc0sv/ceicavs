import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { ICommentRepository } from '../../interfaces/comment.repository'
import type { IComment } from '../../interfaces/blog.interfaces'
import { UpdateCommentCommand } from './update-comment.command'

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler extends BaseCommandHandler<UpdateCommentCommand, IComment> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly commentRepository: ICommentRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: UpdateCommentCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<IComment> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.UPDATE, Subject.COMMENT)) {
      throw new ForbiddenException()
    }

    const comment = await this.commentRepository.findById(command.commentId, tx)

    if (!comment) {
      throw new NotFoundException('Comment')
    }

    if (comment.authorId !== command.userId) {
      throw new ForbiddenException()
    }

    return this.commentRepository.update(command.commentId, command.text, tx)
  }
}
