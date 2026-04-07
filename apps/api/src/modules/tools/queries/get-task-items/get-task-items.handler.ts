import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { ITaskItemRepository } from '../../interfaces/task-item.repository'
import type { ITaskItem } from '../../interfaces/task-item.interfaces'
import { GetTaskItemsQuery } from './get-task-items.query'

@QueryHandler(GetTaskItemsQuery)
export class GetTaskItemsHandler extends BaseQueryHandler<GetTaskItemsQuery, ITaskItem[]> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly taskItemRepository: ITaskItemRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetTaskItemsQuery, tx: TxClient): Promise<ITaskItem[]> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.MANAGE, Subject.TASK_ITEM)) {
      throw new ForbiddenException()
    }

    return this.taskItemRepository.findByUserId(query.userId, tx)
  }
}
