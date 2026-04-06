import type { IJwtUser } from '../../../../common/types'

export class BulkDeleteUsersCommand {
  constructor(
    public readonly user: IJwtUser,
    public readonly ids: string[],
  ) {}
}
