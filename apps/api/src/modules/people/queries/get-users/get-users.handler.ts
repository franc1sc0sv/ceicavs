import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IUserRepository } from '../../interfaces/user.repository'
import type { IUser } from '../../interfaces/people.interfaces'
import { GetUsersQuery } from './get-users.query'

@QueryHandler(GetUsersQuery)
export class GetUsersHandler extends BaseQueryHandler<GetUsersQuery, IUser[]> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly userRepository: IUserRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetUsersQuery, tx: TxClient): Promise<IUser[]> {
    const ability = defineAbilityFor(query.user.role)

    if (!ability.can(Action.MANAGE, Subject.USER)) {
      throw new ForbiddenException()
    }

    return this.userRepository.findMany(query.filters, tx)
  }
}
