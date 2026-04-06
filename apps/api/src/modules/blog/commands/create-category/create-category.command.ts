import type { UserRole } from '@ceicavs/shared'

export class CreateCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly role: UserRole,
  ) {}
}
