import type { UserRole } from '@ceicavs/shared'

export class DeleteCategoryCommand {
  constructor(
    public readonly categoryId: string,
    public readonly role: UserRole,
  ) {}
}
