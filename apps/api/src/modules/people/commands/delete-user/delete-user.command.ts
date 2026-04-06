import type { IJwtUser } from '../../../../common/types'

export class DeleteUserCommand {
  constructor(
    public readonly user: IJwtUser,
    public readonly userId: string,
  ) {}
}
