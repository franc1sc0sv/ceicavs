import type { UserRole } from '@ceicavs/shared'

export class GetMeQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
