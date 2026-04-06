import type { UserRole } from '@ceicavs/shared'

export class DeleteCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
