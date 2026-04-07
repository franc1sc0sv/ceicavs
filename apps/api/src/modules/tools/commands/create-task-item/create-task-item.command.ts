import type { UserRole } from '@ceicavs/shared'

export class CreateTaskItemCommand {
  constructor(
    public readonly userId: string,
    public readonly text: string,
    public readonly role: UserRole,
  ) {}
}
