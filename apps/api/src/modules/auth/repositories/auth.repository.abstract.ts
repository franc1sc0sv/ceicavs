import type { IBaseRepository, RepositoryMethod } from '../../../common/cqrs'
import type { IAuthUser, IAuthUserWithPassword } from '../interfaces/auth.interfaces'

export abstract class IAuthRepository implements IBaseRepository<IAuthUser> {
  abstract findByEmail: RepositoryMethod<[email: string], IAuthUserWithPassword | null>
  abstract findById: RepositoryMethod<[id: string], IAuthUser | null>
}
