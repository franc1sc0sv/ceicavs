import type { IJwtUser } from '../../../../common/types'
import type { IUpdateGroupData } from '../../interfaces/people.interfaces'

export class UpdateGroupCommand {
  constructor(
    public readonly user: IJwtUser,
    public readonly groupId: string,
    public readonly data: IUpdateGroupData,
  ) {}
}
