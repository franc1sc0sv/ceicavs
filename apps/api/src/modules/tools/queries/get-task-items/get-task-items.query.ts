import type { UserRole } from '@ceicavs/shared'

export class GetTaskItemsQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
