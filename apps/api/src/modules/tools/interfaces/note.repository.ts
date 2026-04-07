import type { RepositoryMethod, IBaseRepository } from '../../../common/cqrs'
import type { INote } from './note.interfaces'

export abstract class INoteRepository implements IBaseRepository<INote> {
  abstract findById: RepositoryMethod<[id: string], INote | null>
  abstract findByUserId: RepositoryMethod<[userId: string], INote[]>
  abstract create: RepositoryMethod<[userId: string, content: string], INote>
  abstract update: RepositoryMethod<[id: string, content: string], INote>
  abstract softDelete: RepositoryMethod<[id: string], void>
}
