import type { IBaseRepository, RepositoryMethod } from '../../../common/cqrs'
import type { IRecording, ICreateRecordingData } from './recording.interfaces'

export abstract class IRecordingRepository implements IBaseRepository<IRecording> {
  abstract findByUserId: RepositoryMethod<[userId: string], IRecording[]>
  abstract findById: RepositoryMethod<[id: string], IRecording | null>
  abstract create: RepositoryMethod<[data: ICreateRecordingData], IRecording>
  abstract updateTranscriptionStatus: RepositoryMethod<[id: string, status: 'none' | 'processing' | 'completed'], void>
  abstract softDelete: RepositoryMethod<[id: string], void>
}
