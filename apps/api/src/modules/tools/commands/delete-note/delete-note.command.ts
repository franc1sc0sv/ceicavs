import type { UserRole } from '@ceicavs/shared'

export class DeleteNoteCommand {
  constructor(
    public readonly noteId: string,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
