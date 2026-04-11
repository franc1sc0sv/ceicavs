import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IToolRepository } from '../../interfaces/tool.interfaces'
import type { ITool } from '../../interfaces/tool.interfaces'
import { GetToolsQuery } from './get-tools.query'

@QueryHandler(GetToolsQuery)
export class GetToolsHandler extends BaseQueryHandler<GetToolsQuery, ITool[]> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly toolRepository: IToolRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetToolsQuery, tx: TxClient): Promise<ITool[]> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.TOOL)) {
      throw new ForbiddenException()
    }

    return this.toolRepository.findAll(tx)
  }
}
