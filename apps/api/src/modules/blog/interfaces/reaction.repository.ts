import type { IBaseRepository, RepositoryMethod } from '../../../common/cqrs'
import type { IReaction, IReactionSummary } from './blog.interfaces'

export abstract class IReactionRepository implements IBaseRepository<IReaction> {
  abstract findById: RepositoryMethod<[id: string], IReaction | null>
  abstract findExisting: RepositoryMethod<[postId: string | null, commentId: string | null, userId: string, emoji: string], IReaction | null>
  abstract findSummaryByPost: RepositoryMethod<[postId: string, userId: string], IReactionSummary[]>
  abstract findSummaryByComment: RepositoryMethod<[commentId: string, userId: string], IReactionSummary[]>
  abstract create: RepositoryMethod<[postId: string | null, commentId: string | null, userId: string, emoji: string], IReaction>
  abstract delete: RepositoryMethod<[id: string], void>
}
