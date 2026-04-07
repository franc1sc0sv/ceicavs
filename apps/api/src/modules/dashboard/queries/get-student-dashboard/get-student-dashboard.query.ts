import type { UserRole } from '@ceicavs/shared'

export class GetStudentDashboardQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
