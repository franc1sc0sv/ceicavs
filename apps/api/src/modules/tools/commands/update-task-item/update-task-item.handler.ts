import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { ITaskItemRepository } from '../../interfaces/task-item.repository'
import type { ITaskItem } from '../../interfaces/task-item.interfaces'
import { UpdateTaskItemCommand } from './update-task-item.command'

@CommandHandler(UpdateTaskItemCommand)
export class UpdateTaskItemHandler extends BaseCommandHandler<UpdateTaskItemCommand, ITaskItem> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly taskItemRepository: ITaskItemRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(command: UpdateTaskItemCommand, tx: TxClient, _events: IDomainEvent[]): Promise<ITaskItem> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.UPDATE, Subject.TASK_ITEM)) {
      throw new ForbiddenException()
    }

    const item = await this.taskItemRepository.findById(command.id, tx)

    if (!item || item.userId !== command.userId) {
      throw new ForbiddenException()
    }

    return this.taskItemRepository.update(command.id, command.data, tx)
  }
}
