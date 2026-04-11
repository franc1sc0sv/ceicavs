import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { IRecordingRepository } from './interfaces/recording.repository'
import { ITranscriptionRepository } from './interfaces/transcription.repository'
import { ITranscriptionUserRepository } from './interfaces/user.repository'
import { RecordingRepository } from './repositories/recording.repository'
import { TranscriptionRepository } from './repositories/transcription.repository'
import { TranscriptionUserRepository } from './repositories/user.repository'
import { IAIService } from './providers/ai.provider'
import { GroqService } from './providers/groq.provider'
import { GeminiService } from './providers/gemini.provider'
import { FallbackAIService } from './providers/fallback-ai.provider'
import { TranscriptionResolver } from './resolvers/transcription.resolver'
import { CreateRecordingHandler } from './commands/create-recording/create-recording.handler'
import { UpdateTranscriptionHandler } from './commands/update-transcription/update-transcription.handler'
import { DeleteRecordingHandler } from './commands/delete-recording/delete-recording.handler'
import { GetRecordingsHandler } from './queries/get-recordings/get-recordings.handler'
import { GetRecordingHandler } from './queries/get-recording/get-recording.handler'
import { GenerateSummaryHandler } from './commands/generate-summary/generate-summary.handler'
import { UpdateSummaryPromptHandler } from './commands/update-summary-prompt/update-summary-prompt.handler'
import { GetSummaryPromptHandler } from './queries/get-summary-prompt/get-summary-prompt.handler'

@Module({
  imports: [CqrsModule],
  providers: [
    TranscriptionResolver,
    { provide: IRecordingRepository, useClass: RecordingRepository },
    { provide: ITranscriptionRepository, useClass: TranscriptionRepository },
    { provide: ITranscriptionUserRepository, useClass: TranscriptionUserRepository },
    GroqService,
    GeminiService,
    { provide: IAIService, useClass: FallbackAIService },
    CreateRecordingHandler,
    UpdateTranscriptionHandler,
    DeleteRecordingHandler,
    GetRecordingsHandler,
    GetRecordingHandler,
    GenerateSummaryHandler,
    UpdateSummaryPromptHandler,
    GetSummaryPromptHandler,
  ],
})
export class TranscriptionModule {}
