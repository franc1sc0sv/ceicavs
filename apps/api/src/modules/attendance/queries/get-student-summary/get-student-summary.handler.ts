import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IAttendanceRepository } from '../../repositories/attendance.repository.abstract'
import type { IStudentSummary } from '../../interfaces/attendance.interfaces'
import { GetStudentSummaryQuery } from './get-student-summary.query'

@QueryHandler(GetStudentSummaryQuery)
export class GetStudentSummaryHandler extends BaseQueryHandler<
  GetStudentSummaryQuery,
  IStudentSummary
> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly attendanceRepository: IAttendanceRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetStudentSummaryQuery, tx: TxClient): Promise<IStudentSummary> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.ATTENDANCE_RECORD)) {
      throw new ForbiddenException()
    }

    return this.attendanceRepository.findStudentSummary(query.userId, tx)
  }
}
