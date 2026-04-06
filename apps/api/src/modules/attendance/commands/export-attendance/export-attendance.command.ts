import type { UserRole } from '@ceicavs/shared'
import type { ExportFormat } from '../../enums/export-format.enum'
import type { ReportPeriod } from '../../enums/report-period.enum'

export class ExportAttendanceCommand {
  constructor(
    public readonly groupId: string,
    public readonly period: ReportPeriod,
    public readonly format: ExportFormat,
    public readonly requestedBy: string,
    public readonly role: UserRole,
  ) {}
}
