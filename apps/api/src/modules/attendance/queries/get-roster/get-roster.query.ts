import type { UserRole } from '@ceicavs/shared'

export class GetRosterQuery {
  constructor(
    public readonly groupId: string,
    public readonly date: string,
    public readonly role: UserRole,
  ) {}
}
