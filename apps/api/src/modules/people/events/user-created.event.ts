import type { IDomainEvent } from '../../../common/cqrs'
import type { UserRole } from '@ceicavs/shared'

export class UserCreatedEvent implements IDomainEvent {
  readonly eventName = 'user.created'
  readonly occurredAt: Date

  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
    public readonly creatorId: string,
    public readonly creatorRole: UserRole,
  ) {
    this.occurredAt = new Date()
  }
}
