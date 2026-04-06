import type { IJwtUser } from '../../../../common/types'
import type { ICreateUserData } from '../../interfaces/people.interfaces'

export class CreateUserCommand {
  constructor(
    public readonly user: IJwtUser,
    public readonly data: ICreateUserData,
  ) {}
}
