import type { IJwtUser } from '../../../../common/types'
import type { IUserFilters } from '../../interfaces/people.interfaces'

export class GetUsersQuery {
  constructor(
    public readonly user: IJwtUser,
    public readonly filters: IUserFilters,
  ) {}
}
