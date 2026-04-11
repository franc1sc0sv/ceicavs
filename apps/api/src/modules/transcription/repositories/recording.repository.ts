import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { IRecordingRepository } from '../interfaces/recording.repository'
import type { IRecording, ICreateRecordingData, ITranscriptSegment, ITranscription } from '../interfaces/recording.interfaces'

@Injectable()
export class RecordingRepository extends IRecordingRepository {
  findByUserId = async (userId: string, tx: TxClient): Promise<IRecording[]> => {
    const rows = await tx.recording.findMany({
      where: { userId, deletedAt: null },
      include: { transcription: true },
      orderBy: { createdAt: 'desc' },
    })

    return rows.map((row) => this.mapRow(row))
  }

  findById = async (id: string, tx: TxClient): Promise<IRecording | null> => {
    const row = await tx.recording.findFirst({
      where: { id, deletedAt: null },
      include: { transcription: true },
    })

    return row ? this.mapRow(row) : null
  }

  create = async (data: ICreateRecordingData, tx: TxClient): Promise<IRecording> => {
    const row = await tx.recording.create({
      data: {
        userId: data.userId,
        name: data.name,
        duration: data.duration,
        audioUrl: data.audioUrl,
        cloudinaryPublicId: data.cloudinaryPublicId,
      },
      include: { transcription: true },
    })

    return this.mapRow(row)
  }

  updateTranscriptionStatus = async (
    id: string,
    status: 'none' | 'processing' | 'completed',
    tx: TxClient,
  ): Promise<void> => {
    await tx.recording.update({
      where: { id },
      data: { transcriptionStatus: status },
    })
  }

  softDelete = async (id: string, tx: TxClient): Promise<void> => {
    await tx.recording.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  private mapRow(row: {
    id: string
    userId: string
    name: string
    duration: number
    audioUrl: string | null
    cloudinaryPublicId: string | null
    transcriptionStatus: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    transcription: {
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
    } | null
  }): IRecording {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      duration: row.duration,
      audioUrl: row.audioUrl,
      cloudinaryPublicId: row.cloudinaryPublicId,
      transcriptionStatus: row.transcriptionStatus as IRecording['transcriptionStatus'],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt,
      transcription: row.transcription
        ? {
            id: row.transcription.id,
            recordingId: row.transcription.recordingId,
            status: row.transcription.status as IRecording['transcriptionStatus'],
            summaryStatus: row.transcription.summaryStatus as ITranscription['summaryStatus'],
            fullTranscript: row.transcription.fullTranscript,
            segments: row.transcription.segments != null ? JSON.stringify(row.transcription.segments) : null,
            summary: row.transcription.summary,
            summaryError: row.transcription.summaryError,
            keyTakeaways: row.transcription.keyTakeaways,
            actionItems: row.transcription.actionItems,
            completedAt: row.transcription.completedAt,
          }
        : null,
    }
  }
}
