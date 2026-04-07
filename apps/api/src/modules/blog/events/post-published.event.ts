import type { IDomainEvent } from '../../../common/cqrs'
import type { UserRole } from '@ceicavs/shared'

export class PostPublishedEvent implements IDomainEvent {
  readonly eventName = 'post.published'
  readonly occurredAt: Date

  constructor(
    readonly postId: string,
    readonly reviewerId: string,
    readonly reviewerRole: UserRole,
  ) {
    this.occurredAt = new Date()
  }
}
