import type { IJwtUser } from '../../../../common/types'
import type { ICreateGroupData } from '../../interfaces/people.interfaces'

export class CreateGroupCommand {
  constructor(
    public readonly user: IJwtUser,
    public readonly data: ICreateGroupData,
  ) {}
}
