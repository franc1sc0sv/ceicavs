import type { UserRole } from '@ceicavs/shared'

export class GetNotesQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
