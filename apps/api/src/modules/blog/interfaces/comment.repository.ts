import type { IBaseRepository, RepositoryMethod } from '../../../common/cqrs'
import type { IComment, ICommentWithAuthor } from './blog.interfaces'

export interface ICommentsPage {
  items: ICommentWithAuthor[]
  nextCursor: string | null
}

export abstract class ICommentRepository implements IBaseRepository<IComment> {
  abstract findById: RepositoryMethod<[id: string], IComment | null>
  abstract findByPost: RepositoryMethod<[postId: string], ICommentWithAuthor[]>
  abstract findPageByPost: RepositoryMethod<[postId: string, cursor: string | undefined, limit: number, userId: string], ICommentsPage>
  abstract findPageByParent: RepositoryMethod<[parentId: string, cursor: string | undefined, limit: number, userId: string], ICommentsPage>
  abstract create: RepositoryMethod<[postId: string, authorId: string, text: string, parentId: string | null, depth: number, gifUrl: string | null, gifAlt: string | null], IComment>
  abstract update: RepositoryMethod<[id: string, text: string], IComment>
  abstract softDelete: RepositoryMethod<[id: string], void>
}
