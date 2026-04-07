import type { UserRole } from '@ceicavs/shared'

export class UpdateNoteCommand {
  constructor(
    public readonly noteId: string,
    public readonly content: string,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
