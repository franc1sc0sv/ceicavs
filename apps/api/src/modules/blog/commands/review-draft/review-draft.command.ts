import type { UserRole } from '@ceicavs/shared'
import type { IReviewDraftData } from '../../interfaces/blog.interfaces'

export class ReviewDraftCommand {
  constructor(
    public readonly postId: string,
    public readonly data: IReviewDraftData,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
