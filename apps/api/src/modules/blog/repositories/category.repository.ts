import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { ICategoryRepository } from '../interfaces/category.repository'
import type { ICategory } from '../interfaces/blog.interfaces'

@Injectable()
export class CategoryRepository extends ICategoryRepository {
  findById = async (id: string, tx: TxClient): Promise<ICategory | null> => {
    return tx.category.findFirst({
      where: { id, deletedAt: null },
    })
  }

  findAll = async (tx: TxClient): Promise<ICategory[]> => {
    return tx.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    })
  }

  create = async (name: string, tx: TxClient): Promise<ICategory> => {
    return tx.category.create({ data: { name } })
  }

  update = async (id: string, name: string, tx: TxClient): Promise<ICategory> => {
    return tx.category.update({ where: { id }, data: { name } })
  }

  softDelete = async (id: string, tx: TxClient): Promise<void> => {
    await tx.category.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
