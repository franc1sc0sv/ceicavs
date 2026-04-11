import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { ITranscriptionUserRepository } from '../interfaces/user.repository'

@Injectable()
export class TranscriptionUserRepository extends ITranscriptionUserRepository {
  findSummaryPrompt = async (userId: string, tx: TxClient): Promise<string | null> => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { summaryPrompt: true },
    })
    return user?.summaryPrompt ?? null
  }

  updateSummaryPrompt = async (userId: string, prompt: string | null, tx: TxClient): Promise<void> => {
    await tx.user.update({
      where: { id: userId },
      data: { summaryPrompt: prompt },
    })
  }
}
