import type { UserRole } from '@ceicavs/shared'

export class GetToolsQuery {
  constructor(public readonly role: UserRole) {}
}
