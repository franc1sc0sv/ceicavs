import type { UserRole } from '@ceicavs/shared'

export class GetAdminDashboardQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
