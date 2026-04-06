import type { UserRole } from '@ceicavs/shared'

export class GetCommentsQuery {
  constructor(
    public readonly postId: string,
    public readonly cursor: string | undefined,
    public readonly limit: number,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
