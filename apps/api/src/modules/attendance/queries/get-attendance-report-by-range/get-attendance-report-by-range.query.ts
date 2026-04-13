import type { UserRole } from '@ceicavs/shared'

export class GetAttendanceReportByRangeQuery {
  constructor(
    public readonly groupId: string,
    public readonly dateFrom: string,
    public readonly dateTo: string,
    public readonly studentIds: string[] | null,
    public readonly role: UserRole,
    public readonly userId: string,
  ) {}
}
