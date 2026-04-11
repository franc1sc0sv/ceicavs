import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { IToolRepository } from '../interfaces/tool.interfaces'
import type { ITool } from '../interfaces/tool.interfaces'

@Injectable()
export class ToolRepository extends IToolRepository {
  findAll = async (tx: TxClient): Promise<ITool[]> => {
    const rows = await tx.tool.findMany({
      where: { deletedAt: null },
      include: {
        category: true,
      },
      orderBy: [{ category: { order: 'asc' } }, { name: 'asc' }],
    })

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      icon: row.icon,
      color: row.color,
      category: {
        id: row.category.id,
        name: row.category.name,
        slug: row.category.slug,
        order: row.category.order,
      },
    }))
  }
}
