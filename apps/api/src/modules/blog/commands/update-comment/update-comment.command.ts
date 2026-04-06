import type { UserRole } from '@ceicavs/shared'

export class UpdateCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly text: string,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
