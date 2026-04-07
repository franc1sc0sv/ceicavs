import type { UserRole } from '@ceicavs/shared'

export class DeleteTaskItemCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
