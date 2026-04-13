import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IAttendanceRepository } from '../../repositories/attendance.repository.abstract'
import type { IAttendanceReportResult } from '../../interfaces/attendance.interfaces'
import { GetAttendanceReportByRangeQuery } from './get-attendance-report-by-range.query'

@QueryHandler(GetAttendanceReportByRangeQuery)
export class GetAttendanceReportByRangeHandler extends BaseQueryHandler<
  GetAttendanceReportByRangeQuery,
  IAttendanceReportResult
> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly attendanceRepository: IAttendanceRepository,
  ) {
    super(db)
  }

  protected async handle(
    query: GetAttendanceReportByRangeQuery,
    tx: TxClient,
  ): Promise<IAttendanceReportResult> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)) {
      throw new ForbiddenException()
    }

    return this.attendanceRepository.findAttendanceReportByRange(
      query.groupId,
      query.dateFrom,
      query.dateTo,
      query.studentIds,
      tx,
    )
  }
}
