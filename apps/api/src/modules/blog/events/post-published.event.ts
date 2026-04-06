import type { IDomainEvent } from '../../../common/cqrs'

export class PostPublishedEvent implements IDomainEvent {
  readonly eventName = 'post.published'
  readonly occurredAt: Date

  constructor(readonly postId: string) {
    this.occurredAt = new Date()
  }
}
