import type { IBaseRepository, RepositoryMethod } from '../../../common/cqrs'
import type { ITranscription, IUpdateTranscriptionData, IUpdateSummaryData } from './recording.interfaces'

export abstract class ITranscriptionRepository implements IBaseRepository<ITranscription> {
  abstract findById: RepositoryMethod<[id: string], ITranscription | null>
  abstract create: RepositoryMethod<[recordingId: string], ITranscription>
  abstract update: RepositoryMethod<[data: IUpdateTranscriptionData], ITranscription>
  abstract findByRecordingId: RepositoryMethod<[recordingId: string], ITranscription | null>
  abstract updateSummary: RepositoryMethod<[data: IUpdateSummaryData], ITranscription>
  abstract updateSummaryStatus: RepositoryMethod<[recordingId: string, status: ITranscription['summaryStatus'], errorCode: string | undefined], void>
}
