import type { UserRole } from '@ceicavs/shared'

export class UpdateCategoryCommand {
  constructor(
    public readonly categoryId: string,
    public readonly name: string,
    public readonly role: UserRole,
  ) {}
}
