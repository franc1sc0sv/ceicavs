import type { UserRole } from '@ceicavs/shared'
import type { ReportPeriod } from '../../enums/report-period.enum'

export class GetAttendanceReportQuery {
  constructor(
    public readonly groupId: string,
    public readonly period: ReportPeriod,
    public readonly role: UserRole,
  ) {}
}
