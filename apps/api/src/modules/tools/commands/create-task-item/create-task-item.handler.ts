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
import { CreateTaskItemCommand } from './create-task-item.command'

@CommandHandler(CreateTaskItemCommand)
export class CreateTaskItemHandler extends BaseCommandHandler<CreateTaskItemCommand, ITaskItem> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly taskItemRepository: ITaskItemRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(command: CreateTaskItemCommand, tx: TxClient, _events: IDomainEvent[]): Promise<ITaskItem> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.CREATE, Subject.TASK_ITEM)) {
      throw new ForbiddenException()
    }

    const maxOrder = await this.taskItemRepository.getMaxOrder(command.userId, tx)

    return this.taskItemRepository.create(command.userId, command.text, maxOrder + 1, tx)
  }
}
