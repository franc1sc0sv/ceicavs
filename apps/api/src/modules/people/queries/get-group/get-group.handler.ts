import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { IGroupRepository } from '../../interfaces/group.repository'
import type { IGroup, IGroupMember } from '../../interfaces/people.interfaces'
import { GetGroupQuery } from './get-group.query'

@QueryHandler(GetGroupQuery)
export class GetGroupHandler extends BaseQueryHandler<GetGroupQuery, IGroup & { members: IGroupMember[] }> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly groupRepository: IGroupRepository,
  ) {
    super(db)
  }

  protected async handle(
    query: GetGroupQuery,
    tx: TxClient,
  ): Promise<IGroup & { members: IGroupMember[] }> {
    const ability = defineAbilityFor(query.user.role)

    if (!ability.can(Action.READ, Subject.GROUP)) {
      throw new ForbiddenException()
    }

    const group = await this.groupRepository.findByIdWithMembers(query.groupId, tx)

    if (!group) {
      throw new NotFoundException('Group')
    }

    if (query.user.role === UserRole.TEACHER && group.createdBy !== query.user.id) {
      throw new ForbiddenException()
    }

    return group
  }
}
