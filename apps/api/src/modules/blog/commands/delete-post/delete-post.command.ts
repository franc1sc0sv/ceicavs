import type { UserRole } from '@ceicavs/shared'

export class DeletePostCommand {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
