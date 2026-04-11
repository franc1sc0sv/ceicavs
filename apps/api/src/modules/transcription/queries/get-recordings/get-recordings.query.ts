import type { UserRole } from '@ceicavs/shared'

export class GetRecordingsQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
