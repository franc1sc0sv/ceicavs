import type { UserRole } from '@ceicavs/shared'

export class CreateNoteCommand {
  constructor(
    public readonly userId: string,
    public readonly content: string,
    public readonly role: UserRole,
  ) {}
}
