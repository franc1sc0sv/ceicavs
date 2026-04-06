import type { IBaseRepository, RepositoryMethod } from '../../../common/cqrs'
import type { IPost, IPostWithRelations, ICreatePostData, IUpdatePostData, IPostFilters, PostStatus } from './blog.interfaces'

export interface IPostsPage {
  items: IPostWithRelations[]
  nextCursor: string | null
}

export abstract class IPostRepository implements IBaseRepository<IPost> {
  abstract findById: RepositoryMethod<[id: string], IPost | null>
  abstract findMany: RepositoryMethod<[filters: IPostFilters], IPostWithRelations[]>
  abstract findFeed: RepositoryMethod<[filters: IPostFilters, cursor: string | undefined, limit: number, userId: string], IPostsPage>
  abstract create: RepositoryMethod<[data: ICreatePostData, authorId: string, status: PostStatus], IPost>
  abstract update: RepositoryMethod<[id: string, data: IUpdatePostData], IPost>
  abstract softDelete: RepositoryMethod<[id: string], void>
  abstract updateStatus: RepositoryMethod<[id: string, status: PostStatus, rejectionNote?: string], IPost>
}
