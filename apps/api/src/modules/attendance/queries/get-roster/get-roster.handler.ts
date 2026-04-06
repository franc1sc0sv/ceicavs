import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IAttendanceRepository } from '../../repositories/attendance.repository.abstract'
import type { IGroupRoster } from '../../interfaces/attendance.interfaces'
import { GetRosterQuery } from './get-roster.query'

@QueryHandler(GetRosterQuery)
export class GetRosterHandler extends BaseQueryHandler<GetRosterQuery, IGroupRoster> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly attendanceRepository: IAttendanceRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetRosterQuery, tx: TxClient): Promise<IGroupRoster> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)) {
      throw new ForbiddenException()
    }

    return this.attendanceRepository.findRoster(query.groupId, query.date, tx)
  }
}
