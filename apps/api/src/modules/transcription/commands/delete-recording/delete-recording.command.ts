import type { UserRole } from '@ceicavs/shared'

export class DeleteRecordingCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
