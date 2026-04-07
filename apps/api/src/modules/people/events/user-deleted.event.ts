import type { IDomainEvent } from '../../../common/cqrs'
import type { UserRole } from '@ceicavs/shared'

export class UserDeletedEvent implements IDomainEvent {
  readonly eventName = 'user.deleted'
  readonly occurredAt: Date

  constructor(
    public readonly userId: string,
    public readonly deleterId: string,
    public readonly deleterRole: UserRole,
  ) {
    this.occurredAt = new Date()
  }
}
