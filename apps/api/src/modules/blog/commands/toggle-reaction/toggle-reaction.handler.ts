import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IReactionRepository } from '../../interfaces/reaction.repository'
import type { IReactionSummary } from '../../interfaces/blog.interfaces'
import { ToggleReactionCommand } from './toggle-reaction.command'

@CommandHandler(ToggleReactionCommand)
export class ToggleReactionHandler extends BaseCommandHandler<ToggleReactionCommand, IReactionSummary[]> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly reactionRepository: IReactionRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: ToggleReactionCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<IReactionSummary[]> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.MANAGE, Subject.REACTION)) {
      throw new ForbiddenException()
    }

    const existing = await this.reactionRepository.findExisting(
      command.postId,
      command.commentId,
      command.userId,
      command.emoji,
      tx,
    )

    if (existing) {
      await this.reactionRepository.delete(existing.id, tx)
    } else {
      await this.reactionRepository.create(command.postId, command.commentId, command.userId, command.emoji, tx)
    }

    if (command.postId) {
      return this.reactionRepository.findSummaryByPost(command.postId, command.userId, tx)
    }

    return this.reactionRepository.findSummaryByComment(command.commentId!, command.userId, tx)
  }
}
