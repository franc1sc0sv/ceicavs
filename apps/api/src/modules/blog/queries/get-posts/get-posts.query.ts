import type { UserRole } from '@ceicavs/shared'
import type { IPostFilters } from '../../interfaces/blog.interfaces'

export class GetPostsQuery {
  constructor(
    public readonly filters: IPostFilters,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
