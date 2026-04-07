import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { ITaskItemRepository } from '../interfaces/task-item.repository'
import type { ITaskItem, IUpdateTaskItemData, IReorderItem } from '../interfaces/task-item.interfaces'

@Injectable()
export class TaskItemRepository extends ITaskItemRepository {
  findById = async (id: string, tx: TxClient): Promise<ITaskItem | null> => {
    return tx.taskItem.findFirst({
      where: { id, deletedAt: null },
    }) as Promise<ITaskItem | null>
  }

  findByUserId = async (userId: string, tx: TxClient): Promise<ITaskItem[]> => {
    return tx.taskItem.findMany({
      where: { userId, deletedAt: null },
      orderBy: { order: 'asc' },
    }) as Promise<ITaskItem[]>
  }

  create = async (userId: string, text: string, order: number, tx: TxClient): Promise<ITaskItem> => {
    return tx.taskItem.create({
      data: { userId, text, order },
    }) as Promise<ITaskItem>
  }

  update = async (id: string, data: IUpdateTaskItemData, tx: TxClient): Promise<ITaskItem> => {
    return tx.taskItem.update({
      where: { id },
      data,
    }) as Promise<ITaskItem>
  }

  softDelete = async (id: string, tx: TxClient): Promise<void> => {
    await tx.taskItem.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  reorder = async (items: IReorderItem[], tx: TxClient): Promise<void> => {
    for (const item of items) {
      await tx.taskItem.update({ where: { id: item.id }, data: { order: item.order } })
    }
  }

  getMaxOrder = async (userId: string, tx: TxClient): Promise<number> => {
    const result = await tx.taskItem.findFirst({
      where: { userId, deletedAt: null },
      orderBy: { order: 'desc' },
      select: { order: true },
    })
    return result?.order ?? 0
  }
}
