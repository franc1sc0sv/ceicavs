import type { IDomainEvent } from '../../../common/cqrs'
import type { UserRole } from '@ceicavs/shared'
import type { PostStatus } from '../interfaces/blog.interfaces'

export class PostCreatedEvent implements IDomainEvent {
  readonly eventName = 'post.created'
  readonly occurredAt: Date

  constructor(
    readonly postId: string,
    readonly authorId: string,
    readonly status: PostStatus,
    readonly actorRole: UserRole,
  ) {
    this.occurredAt = new Date()
  }
}
