import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { ITaskItemRepository } from '../../interfaces/task-item.repository'
import { ReorderTaskItemsCommand } from './reorder-task-items.command'

@CommandHandler(ReorderTaskItemsCommand)
export class ReorderTaskItemsHandler extends BaseCommandHandler<ReorderTaskItemsCommand, void> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly taskItemRepository: ITaskItemRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(command: ReorderTaskItemsCommand, tx: TxClient, _events: IDomainEvent[]): Promise<void> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.UPDATE, Subject.TASK_ITEM)) {
      throw new ForbiddenException()
    }

    for (const item of command.items) {
      const existing = await this.taskItemRepository.findById(item.id, tx)

      if (!existing || existing.userId !== command.userId) {
        throw new ForbiddenException()
      }
    }

    await this.taskItemRepository.reorder(command.items, tx)
  }
}
