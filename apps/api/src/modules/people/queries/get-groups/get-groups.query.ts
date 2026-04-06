import type { IJwtUser } from '../../../../common/types'
import type { IGroupFilters } from '../../interfaces/people.interfaces'

export class GetGroupsQuery {
  constructor(
    public readonly user: IJwtUser,
    public readonly filters: IGroupFilters,
  ) {}
}
