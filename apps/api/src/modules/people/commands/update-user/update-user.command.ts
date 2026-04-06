import type { IJwtUser } from '../../../../common/types'
import type { IUpdateUserData } from '../../interfaces/people.interfaces'

export class UpdateUserCommand {
  constructor(
    public readonly user: IJwtUser,
    public readonly userId: string,
    public readonly data: IUpdateUserData,
  ) {}
}
