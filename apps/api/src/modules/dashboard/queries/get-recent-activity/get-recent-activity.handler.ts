import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IDashboardRepository } from '../../repositories/dashboard.repository.abstract'
import type { IActivityItem } from '../../interfaces/dashboard.interfaces'
import { GetRecentActivityQuery } from './get-recent-activity.query'

@QueryHandler(GetRecentActivityQuery)
export class GetRecentActivityHandler extends BaseQueryHandler<
  GetRecentActivityQuery,
  IActivityItem[]
> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly dashboardRepository: IDashboardRepository,
  ) {
    super(db)
  }

  protected async handle(
    query: GetRecentActivityQuery,
    tx: TxClient,
  ): Promise<IActivityItem[]> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.ACTIVITY)) {
      throw new ForbiddenException()
    }

    if (query.role === UserRole.ADMIN) {
      return this.dashboardRepository.findRecentActivityAll(query.limit, tx)
    }

    if (query.role === UserRole.TEACHER) {
      return this.dashboardRepository.findRecentActivityForTeacher(query.userId, query.limit, tx)
    }

    return this.dashboardRepository.findRecentActivityForUser(query.userId, query.limit, tx)
  }
}
