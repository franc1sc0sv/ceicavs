import type { IJwtUser } from '../../../../common/types'

export class GetUserQuery {
  constructor(
    public readonly user: IJwtUser,
    public readonly userId: string,
  ) {}
}
