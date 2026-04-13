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

function buildDateRange(period: ReportPeriod, anchorDate: string): { from: Date; to: Date } {
  if (period === ReportPeriod.DAILY) {
    return {
      from: new Date(anchorDate + 'T00:00:00Z'),
      to: new Date(anchorDate + 'T23:59:59.999Z'),
    }
  }

  if (period === ReportPeriod.WEEKLY) {
    const anchor = new Date(anchorDate + 'T00:00:00Z')
    const dayOfWeek = anchor.getUTCDay()
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const from = new Date(anchorDate + 'T00:00:00Z')
    from.setUTCDate(from.getUTCDate() - daysFromMonday)
    const to = new Date(from)
    to.setUTCDate(to.getUTCDate() + 6)
    to.setUTCHours(23, 59, 59, 999)
    return { from, to }
  }

  const anchor = new Date(anchorDate + 'T00:00:00Z')
  const year = anchor.getUTCFullYear()
  const month = anchor.getUTCMonth()
  return {
    from: new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)),
    to: new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)),
  }
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

    const dateRange = buildDateRange(query.period, query.date)

    return this.attendanceRepository.findAttendanceReport(query.groupId, dateRange, tx)
  }
}
