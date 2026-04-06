import type { UserRole } from '@ceicavs/shared'

export class GetGroupsQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
