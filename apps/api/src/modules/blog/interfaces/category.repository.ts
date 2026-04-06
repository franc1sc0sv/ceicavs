import type { IBaseRepository, RepositoryMethod } from '../../../common/cqrs'
import type { ICategory } from './blog.interfaces'

export abstract class ICategoryRepository implements IBaseRepository<ICategory> {
  abstract findById: RepositoryMethod<[id: string], ICategory | null>
  abstract findAll: RepositoryMethod<[], ICategory[]>
  abstract create: RepositoryMethod<[name: string], ICategory>
  abstract update: RepositoryMethod<[id: string, name: string], ICategory>
  abstract softDelete: RepositoryMethod<[id: string], void>
}
