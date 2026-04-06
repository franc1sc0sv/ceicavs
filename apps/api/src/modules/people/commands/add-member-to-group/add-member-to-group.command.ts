import type { IJwtUser } from '../../../../common/types'

export class AddMemberToGroupCommand {
  constructor(
    public readonly user: IJwtUser,
    public readonly groupId: string,
    public readonly userId: string,
  ) {}
}
