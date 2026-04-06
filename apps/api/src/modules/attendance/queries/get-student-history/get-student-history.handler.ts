import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IAttendanceRepository } from '../../repositories/attendance.repository.abstract'
import type { IStudentHistoryRecord } from '../../interfaces/attendance.interfaces'
import { GetStudentHistoryQuery } from './get-student-history.query'

@QueryHandler(GetStudentHistoryQuery)
export class GetStudentHistoryHandler extends BaseQueryHandler<
  GetStudentHistoryQuery,
  IStudentHistoryRecord[]
> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly attendanceRepository: IAttendanceRepository,
  ) {
    super(db)
  }

  protected async handle(
    query: GetStudentHistoryQuery,
    tx: TxClient,
  ): Promise<IStudentHistoryRecord[]> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.ATTENDANCE_RECORD)) {
      throw new ForbiddenException()
    }

    return this.attendanceRepository.findStudentHistory(query.userId, tx)
  }
}
