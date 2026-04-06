import type { IJwtUser } from '../../../../common/types'

export class DeleteGroupCommand {
  constructor(
    public readonly user: IJwtUser,
    public readonly groupId: string,
  ) {}
}
