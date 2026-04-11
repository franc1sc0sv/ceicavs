import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { ITranscriptionRepository } from '../../interfaces/transcription.repository'
import { IAIService } from '../../providers/ai.provider'
import {
  GENERATE_SUMMARY_SYSTEM_PROMPT,
  CHUNK_SUMMARY_SYSTEM_PROMPT,
  buildGenerateSummaryUserPrompt,
  buildChunkUserPrompt,
  buildCombineUserPrompt,
} from '../../prompts/generate-summary.prompt'
import { GenerateSummaryCommand } from './generate-summary.command'

const SummaryErrorCode = {
  RATE_LIMIT_DAY: 'rate_limit_day',
  RATE_LIMIT_MINUTE: 'rate_limit_minute',
  REQUEST_TOO_LARGE: 'request_too_large',
  JSON_ERROR: 'json_error',
  UNKNOWN: 'unknown',
} as const

type SummaryErrorCode = (typeof SummaryErrorCode)[keyof typeof SummaryErrorCode]

function parseAIError(error: unknown): SummaryErrorCode {
  if (!(error instanceof Error)) return SummaryErrorCode.UNKNOWN

  const status = (error as { status?: number }).status
  const message = error.message

  if (status === 429 || message.includes('RESOURCE_EXHAUSTED')) {
    const isDaily = message.includes('per day') || message.includes('TPD')
    return isDaily ? SummaryErrorCode.RATE_LIMIT_DAY : SummaryErrorCode.RATE_LIMIT_MINUTE
  }

  if (status === 413) return SummaryErrorCode.REQUEST_TOO_LARGE

  if (status === 400 && message.includes('json_validate_failed')) return SummaryErrorCode.JSON_ERROR

  return SummaryErrorCode.UNKNOWN
}

interface GroqSummaryResponse {
  summary: string
  keyTakeaways: string[]
  actionItems: string[]
}

const CHUNK_SIZE = 15_000

function splitIntoChunks(text: string): string[] {
  if (text.length <= CHUNK_SIZE) return [text]
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE))
  }
  return chunks
}

function serializeChunkSummaries(summaries: GroqSummaryResponse[]): string {
  return summaries
    .map((s, i) => {
      const takeaways = s.keyTakeaways.map((t) => `- ${t}`).join('\n')
      const actions = s.actionItems.length ? s.actionItems.map((a) => `- ${a}`).join('\n') : 'None'
      return `=== Part ${i + 1}/${summaries.length} ===\nSummary: ${s.summary}\nKey Takeaways:\n${takeaways}\nAction Items:\n${actions}`
    })
    .join('\n\n')
}

@CommandHandler(GenerateSummaryCommand)
export class GenerateSummaryHandler extends BaseCommandHandler<GenerateSummaryCommand, void> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly transcriptionRepository: ITranscriptionRepository,
    private readonly aiService: IAIService,
  ) {
    super(db, eventEmitter)
  }

  override async execute(command: GenerateSummaryCommand): Promise<void> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.TRANSCRIBE, Subject.RECORDING)) {
      throw new ForbiddenException()
    }

    const transcription = await this.db.$transaction((tx) =>
      this.transcriptionRepository.findByRecordingId(command.recordingId, tx),
    )

    if (!transcription?.fullTranscript) {
      throw new Error('No transcript available for summarization')
    }

    await this.db.$transaction((tx) =>
      this.transcriptionRepository.updateSummaryStatus(command.recordingId, 'generating', undefined, tx),
    )

    try {
      const parsed = await this.summarize(transcription.fullTranscript, command.prompt ?? undefined)

      await this.db.$transaction((tx) =>
        this.transcriptionRepository.updateSummary(
          {
            recordingId: command.recordingId,
            summary: parsed.summary ?? '',
            keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [],
            actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
          },
          tx,
        ),
      )
    } catch (error: unknown) {
      const errorCode = parseAIError(error)
      await this.db.$transaction((tx) =>
        this.transcriptionRepository.updateSummaryStatus(command.recordingId, 'failed', errorCode, tx),
      )
      throw error
    }
  }

  protected async handle(_command: GenerateSummaryCommand, _tx: TxClient, _events: IDomainEvent[]): Promise<void> {}

  private async summarize(fullTranscript: string, customPrompt: string | undefined): Promise<GroqSummaryResponse> {
    const chunks = splitIntoChunks(fullTranscript)

    if (chunks.length === 1) {
      const userMessage = customPrompt
        ? `${customPrompt}\n\nTranscript:\n${chunks[0]}`
        : buildGenerateSummaryUserPrompt(chunks[0])

      const content = await this.aiService.createCompletion({
        systemPrompt: GENERATE_SUMMARY_SYSTEM_PROMPT,
        userMessage,
      })
      return JSON.parse(content) as GroqSummaryResponse
    }

    const chunkSummaries: GroqSummaryResponse[] = []
    for (const [i, chunk] of chunks.entries()) {
      const content = await this.aiService.createCompletion({
        systemPrompt: CHUNK_SUMMARY_SYSTEM_PROMPT,
        userMessage: buildChunkUserPrompt(chunk, i, chunks.length),
      })
      chunkSummaries.push(JSON.parse(content) as GroqSummaryResponse)
    }

    const userMessage = customPrompt
      ? `${customPrompt}\n\n${serializeChunkSummaries(chunkSummaries)}`
      : buildCombineUserPrompt(serializeChunkSummaries(chunkSummaries))

    const combined = await this.aiService.createCompletion({
      systemPrompt: GENERATE_SUMMARY_SYSTEM_PROMPT,
      userMessage,
    })
    return JSON.parse(combined) as GroqSummaryResponse
  }
}
