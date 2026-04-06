import type { IJwtUser } from '../../../../common/types'

export class GetGroupQuery {
  constructor(
    public readonly user: IJwtUser,
    public readonly groupId: string,
  ) {}
}
