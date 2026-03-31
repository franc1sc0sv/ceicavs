import type { TxClient } from '@ceicavs/db'

export abstract class IDatabaseService {
  abstract $transaction<T>(fn: (tx: TxClient) => Promise<T>): Promise<T>
}
