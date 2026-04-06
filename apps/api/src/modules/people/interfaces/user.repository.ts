import type { UserRole } from '@ceicavs/shared'
import type { IBaseRepository, RepositoryMethod } from '../../../common/cqrs'
import type { IUser, IUserFilters, ICreateUserData, IUpdateUserData } from './people.interfaces'

export abstract class IUserRepository implements IBaseRepository<IUser> {
  abstract findMany: RepositoryMethod<[filters: IUserFilters], IUser[]>
  abstract findById: RepositoryMethod<[id: string], IUser | null>
  abstract create: RepositoryMethod<[data: ICreateUserData], IUser>
  abstract update: RepositoryMethod<[id: string, data: IUpdateUserData], IUser>
  abstract softDelete: RepositoryMethod<[id: string], void>
  abstract softDeleteMany: RepositoryMethod<[ids: string[]], void>
  abstract updateRole: RepositoryMethod<[id: string, role: UserRole], IUser>
  abstract updateRoleMany: RepositoryMethod<[ids: string[], role: UserRole], void>
}
