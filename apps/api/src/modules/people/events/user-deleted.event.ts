import type { IDomainEvent } from '../../../common/cqrs'

export class UserDeletedEvent implements IDomainEvent {
  readonly eventName = 'user.deleted'
  readonly occurredAt: Date

  constructor(public readonly userId: string) {
    this.occurredAt = new Date()
  }
}
