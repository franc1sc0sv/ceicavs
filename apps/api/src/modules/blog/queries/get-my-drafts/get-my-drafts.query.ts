import type { UserRole } from '@ceicavs/shared'

export class GetMyDraftsQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
