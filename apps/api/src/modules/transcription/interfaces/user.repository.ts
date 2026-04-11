import type { RepositoryMethod } from '../../../common/cqrs'

export abstract class ITranscriptionUserRepository {
  abstract findSummaryPrompt: RepositoryMethod<[userId: string], string | null>
  abstract updateSummaryPrompt: RepositoryMethod<[userId: string, prompt: string | null], void>
}
