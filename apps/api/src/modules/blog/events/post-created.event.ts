import type { IDomainEvent } from '../../../common/cqrs'
import type { PostStatus } from '../interfaces/blog.interfaces'

export class PostCreatedEvent implements IDomainEvent {
  readonly eventName = 'post.created'
  readonly occurredAt: Date

  constructor(
    readonly postId: string,
    readonly authorId: string,
    readonly status: PostStatus,
  ) {
    this.occurredAt = new Date()
  }
}
