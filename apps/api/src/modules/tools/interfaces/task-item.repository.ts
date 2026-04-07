import type { RepositoryMethod, IBaseRepository } from '../../../common/cqrs'
import type { ITaskItem, IUpdateTaskItemData, IReorderItem } from './task-item.interfaces'

export abstract class ITaskItemRepository implements IBaseRepository<ITaskItem> {
  abstract findById: RepositoryMethod<[id: string], ITaskItem | null>
  abstract findByUserId: RepositoryMethod<[userId: string], ITaskItem[]>
  abstract create: RepositoryMethod<[userId: string, text: string, order: number], ITaskItem>
  abstract update: RepositoryMethod<[id: string, data: IUpdateTaskItemData], ITaskItem>
  abstract softDelete: RepositoryMethod<[id: string], void>
  abstract reorder: RepositoryMethod<[items: IReorderItem[]], void>
  abstract getMaxOrder: RepositoryMethod<[userId: string], number>
}
