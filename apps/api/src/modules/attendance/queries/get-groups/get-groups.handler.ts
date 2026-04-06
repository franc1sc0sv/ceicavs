import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IAttendanceRepository } from '../../repositories/attendance.repository.abstract'
import type { IAttendanceGroup } from '../../interfaces/attendance.interfaces'
import { GetGroupsQuery } from './get-groups.query'

@QueryHandler(GetGroupsQuery)
export class GetGroupsHandler extends BaseQueryHandler<GetGroupsQuery, IAttendanceGroup[]> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly attendanceRepository: IAttendanceRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetGroupsQuery, tx: TxClient): Promise<IAttendanceGroup[]> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)) {
      throw new ForbiddenException()
    }

    if (query.role === UserRole.TEACHER) {
      return this.attendanceRepository.findGroupsForTeacher(query.userId, tx)
    }

    return this.attendanceRepository.findGroupsForAdmin(tx)
  }
}
