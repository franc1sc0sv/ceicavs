import type { IJwtUser } from '../../../../common/types'
import type { UserRole } from '@ceicavs/shared'

export class BulkUpdateUsersCommand {
  constructor(
    public readonly user: IJwtUser,
    public readonly ids: string[],
    public readonly role: UserRole,
  ) {}
}
