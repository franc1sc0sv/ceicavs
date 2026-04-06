import type { UserRole } from '@ceicavs/shared'

export class ToggleReactionCommand {
  constructor(
    public readonly postId: string | null,
    public readonly commentId: string | null,
    public readonly userId: string,
    public readonly emoji: string,
    public readonly role: UserRole,
  ) {}
}
