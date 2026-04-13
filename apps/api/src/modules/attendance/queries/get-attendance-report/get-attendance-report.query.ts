import type { UserRole } from '@ceicavs/shared'
import type { ReportPeriod } from '../../enums/report-period.enum'

export class GetAttendanceReportQuery {
  constructor(
    public readonly groupId: string,
    public readonly period: ReportPeriod,
    public readonly date: string,
    public readonly role: UserRole,
  ) {}
}
