import type { UserRole } from '@ceicavs/shared'
import type { IPostFilters } from '../../interfaces/blog.interfaces'

export class GetFeedQuery {
  constructor(
    public readonly filters: IPostFilters,
    public readonly cursor: string | undefined,
    public readonly limit: number,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
