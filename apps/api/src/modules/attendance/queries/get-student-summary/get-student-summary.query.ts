import type { UserRole } from '@ceicavs/shared'

export class GetStudentSummaryQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
