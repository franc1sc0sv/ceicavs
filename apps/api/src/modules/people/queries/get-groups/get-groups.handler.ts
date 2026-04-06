import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IGroupRepository } from '../../interfaces/group.repository'
import type { IGroup, IGroupFilters } from '../../interfaces/people.interfaces'
import { GetGroupsQuery } from './get-groups.query'

@QueryHandler(GetGroupsQuery)
export class GetGroupsHandler extends BaseQueryHandler<GetGroupsQuery, IGroup[]> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly groupRepository: IGroupRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetGroupsQuery, tx: TxClient): Promise<IGroup[]> {
    const ability = defineAbilityFor(query.user.role)

    if (!ability.can(Action.READ, Subject.GROUP)) {
      throw new ForbiddenException()
    }

    const filters: IGroupFilters = { ...query.filters }

    if (query.user.role === UserRole.TEACHER) {
      filters.createdBy = query.user.id
    }

    return this.groupRepository.findMany(filters, tx)
  }
}
