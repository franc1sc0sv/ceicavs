import type { UserRole } from '@ceicavs/shared'

export class AddCommentCommand {
  constructor(
    public readonly postId: string,
    public readonly authorId: string,
    public readonly text: string,
    public readonly role: UserRole,
    public readonly parentId?: string | null,
    public readonly gifUrl?: string | null,
    public readonly gifAlt?: string | null,
  ) {}
}
