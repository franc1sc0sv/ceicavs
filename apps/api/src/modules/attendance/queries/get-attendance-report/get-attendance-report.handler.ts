import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IAttendanceRepository } from '../../repositories/attendance.repository.abstract'
import { ReportPeriod } from '../../enums/report-period.enum'
import type { IStudentReport } from '../../interfaces/attendance.interfaces'
import { GetAttendanceReportQuery } from './get-attendance-report.query'

function buildDateRange(period: ReportPeriod): { from: Date; to: Date } {
  const to = new Date()
  to.setHours(23, 59, 59, 999)
  const from = new Date()

  if (period === ReportPeriod.DAILY) {
    from.setHours(0, 0, 0, 0)
  } else if (period === ReportPeriod.WEEKLY) {
    from.setDate(from.getDate() - 6)
    from.setHours(0, 0, 0, 0)
  } else {
    from.setDate(from.getDate() - 29)
    from.setHours(0, 0, 0, 0)
  }

  return { from, to }
}

@QueryHandler(GetAttendanceReportQuery)
export class GetAttendanceReportHandler extends BaseQueryHandler<
  GetAttendanceReportQuery,
  IStudentReport[]
> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly attendanceRepository: IAttendanceRepository,
  ) {
    super(db)
  }

  protected async handle(
    query: GetAttendanceReportQuery,
    tx: TxClient,
  ): Promise<IStudentReport[]> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)) {
      throw new ForbiddenException()
    }

    const dateRange = buildDateRange(query.period)

    return this.attendanceRepository.findAttendanceReport(query.groupId, dateRange, tx)
  }
}
