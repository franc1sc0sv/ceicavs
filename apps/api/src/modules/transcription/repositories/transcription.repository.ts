import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { ITranscriptionRepository } from '../interfaces/transcription.repository'
import type { ITranscription, IUpdateTranscriptionData, IUpdateSummaryData } from '../interfaces/recording.interfaces'

@Injectable()
export class TranscriptionRepository extends ITranscriptionRepository {
  findById = async (id: string, tx: TxClient): Promise<ITranscription | null> => {
    const row = await tx.transcription.findUnique({ where: { id } })
    return row ? this.mapRow(row) : null
  }

  create = async (recordingId: string, tx: TxClient): Promise<ITranscription> => {
    const row = await tx.transcription.create({
      data: { recordingId, status: 'none' },
    })

    return this.mapRow(row)
  }

  update = async (data: IUpdateTranscriptionData, tx: TxClient): Promise<ITranscription> => {
    const row = await tx.transcription.update({
      where: { recordingId: data.recordingId },
      data: {
        fullTranscript: data.fullTranscript,
        segments: JSON.parse(JSON.stringify(data.segments)),
        summary: data.summary,
        status: 'completed',
        completedAt: new Date(),
      },
    })

    return this.mapRow(row)
  }

  findByRecordingId = async (recordingId: string, tx: TxClient): Promise<ITranscription | null> => {
    const row = await tx.transcription.findUnique({ where: { recordingId } })
    return row ? this.mapRow(row) : null
  }

  updateSummary = async (data: IUpdateSummaryData, tx: TxClient): Promise<ITranscription> => {
    const row = await tx.transcription.update({
      where: { recordingId: data.recordingId },
      data: {
        summary: data.summary,
        keyTakeaways: data.keyTakeaways,
        actionItems: data.actionItems,
        summaryStatus: 'completed',
      },
    })
    return this.mapRow(row)
  }

  updateSummaryStatus = async (recordingId: string, status: ITranscription['summaryStatus'], errorCode: string | undefined, tx: TxClient): Promise<void> => {
    await tx.transcription.update({
      where: { recordingId },
      data: { summaryStatus: status, ...(errorCode !== undefined ? { summaryError: errorCode } : {}) },
    })
  }

  private mapRow(row: {
    id: string
    recordingId: string
    status: string
    summaryStatus: string
    fullTranscript: string | null
    segments: unknown
    summary: string | null
    summaryError: string | null
    keyTakeaways: string[]
    actionItems: string[]
    completedAt: Date | null
  }): ITranscription {
    return {
      id: row.id,
      recordingId: row.recordingId,
      status: row.status as ITranscription['status'],
      summaryStatus: row.summaryStatus as ITranscription['summaryStatus'],
      fullTranscript: row.fullTranscript,
      segments: row.segments != null ? JSON.stringify(row.segments) : null,
      summary: row.summary,
      summaryError: row.summaryError,
      keyTakeaways: row.keyTakeaways,
      actionItems: row.actionItems,
      completedAt: row.completedAt,
    }
  }
}
