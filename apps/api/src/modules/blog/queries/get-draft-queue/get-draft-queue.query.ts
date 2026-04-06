import type { UserRole } from '@ceicavs/shared'

export class GetDraftQueueQuery {
  constructor(public readonly role: UserRole) {}
}
