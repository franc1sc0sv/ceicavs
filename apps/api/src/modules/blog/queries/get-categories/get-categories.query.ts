import type { UserRole } from '@ceicavs/shared'

export class GetCategoriesQuery {
  constructor(public readonly role: UserRole) {}
}
