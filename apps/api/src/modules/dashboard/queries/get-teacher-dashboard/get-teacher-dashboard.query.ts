import type { UserRole } from '@ceicavs/shared'

export class GetTeacherDashboardQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
