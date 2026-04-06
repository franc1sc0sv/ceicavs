import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { ICommentRepository } from '../../interfaces/comment.repository'
import { DeleteCommentCommand } from './delete-comment.command'

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler extends BaseCommandHandler<DeleteCommentCommand, boolean> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly commentRepository: ICommentRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: DeleteCommentCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<boolean> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.DELETE, Subject.COMMENT)) {
      throw new ForbiddenException()
    }

    const comment = await this.commentRepository.findById(command.commentId, tx)

    if (!comment) {
      throw new NotFoundException('Comment')
    }

    const isAdmin = command.role === UserRole.ADMIN
    const isAuthor = comment.authorId === command.userId

    if (!isAdmin && !isAuthor) {
      throw new ForbiddenException()
    }

    await this.commentRepository.softDelete(command.commentId, tx)

    return true
  }
}
