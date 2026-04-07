import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { INoteRepository } from '../interfaces/note.repository'
import type { INote } from '../interfaces/note.interfaces'

@Injectable()
export class NoteRepository extends INoteRepository {
  findById = async (id: string, tx: TxClient): Promise<INote | null> => {
    return tx.note.findFirst({
      where: { id, deletedAt: null },
    }) as Promise<INote | null>
  }

  findByUserId = async (userId: string, tx: TxClient): Promise<INote[]> => {
    return tx.note.findMany({
      where: { userId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    }) as Promise<INote[]>
  }

  create = async (userId: string, content: string, tx: TxClient): Promise<INote> => {
    return tx.note.create({
      data: { userId, content },
    }) as Promise<INote>
  }

  update = async (id: string, content: string, tx: TxClient): Promise<INote> => {
    return tx.note.update({
      where: { id },
      data: { content },
    }) as Promise<INote>
  }

  softDelete = async (id: string, tx: TxClient): Promise<void> => {
    await tx.note.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
