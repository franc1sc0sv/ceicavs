import type { IBaseRepository, RepositoryMethod } from '../../../common/cqrs'
import type { IGroup, IGroupMember, IGroupFilters, ICreateGroupData, IUpdateGroupData } from './people.interfaces'

export abstract class IGroupRepository implements IBaseRepository<IGroup> {
  abstract findMany: RepositoryMethod<[filters: IGroupFilters], IGroup[]>
  abstract findById: RepositoryMethod<[id: string], IGroup | null>
  abstract findByIdWithMembers: RepositoryMethod<[id: string], (IGroup & { members: IGroupMember[] }) | null>
  abstract create: RepositoryMethod<[data: ICreateGroupData, createdBy: string], IGroup>
  abstract update: RepositoryMethod<[id: string, data: IUpdateGroupData], IGroup>
  abstract softDelete: RepositoryMethod<[id: string], void>
  abstract addMember: RepositoryMethod<[groupId: string, userId: string], void>
  abstract removeMember: RepositoryMethod<[groupId: string, userId: string], void>
}
