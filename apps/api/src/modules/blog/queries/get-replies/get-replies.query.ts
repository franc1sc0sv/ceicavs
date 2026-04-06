import type { UserRole } from '@ceicavs/shared'

export class GetRepliesQuery {
  constructor(
    public readonly parentId: string,
    public readonly cursor: string | undefined,
    public readonly limit: number,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
