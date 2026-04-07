import type { IDomainEvent } from '../../../common/cqrs'
import type { UserRole } from '@ceicavs/shared'
import type { DraftAction } from '../interfaces/blog.interfaces'

export class DraftReviewedEvent implements IDomainEvent {
  readonly eventName = 'draft.reviewed'
  readonly occurredAt: Date

  constructor(
    readonly postId: string,
    readonly action: DraftAction,
    readonly reviewerId: string,
    readonly actorRole: UserRole,
  ) {
    this.occurredAt = new Date()
  }
}
