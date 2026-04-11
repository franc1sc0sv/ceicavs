import type { UserRole } from '@ceicavs/shared'

export class GetRecordingQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
