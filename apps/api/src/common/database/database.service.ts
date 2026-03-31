import { Injectable } from '@nestjs/common'
import { prisma } from '@ceicavs/db'
import type { TxClient } from '@ceicavs/db'
import { IDatabaseService } from './database.abstract'

@Injectable()
export class PrismaDatabaseService extends IDatabaseService {
  async $transaction<T>(fn: (tx: TxClient) => Promise<T>): Promise<T> {
    return prisma.$transaction(fn)
  }
}
