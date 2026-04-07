import type { UserRole } from '@ceicavs/shared'

export class GetRecentActivityQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
    public readonly limit: number,
  ) {}
}
