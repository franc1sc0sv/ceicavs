import type { UserRole } from '@ceicavs/shared'

export class GetPostByIdQuery {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
