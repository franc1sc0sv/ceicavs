import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'
import type { IJwtUser } from '../../../common/types'
import { RecordingType } from '../types/recording.type'
import { AITokenUsageType } from '../types/ai-token-usage.type'
import { CreateRecordingInput } from '../commands/create-recording/create-recording.input'
import { UpdateTranscriptionInput } from '../commands/update-transcription/update-transcription.input'
import { DeleteRecordingInput } from '../commands/delete-recording/delete-recording.input'
import { GenerateSummaryInput } from '../commands/generate-summary/generate-summary.input'
import { UpdateSummaryPromptInput } from '../commands/update-summary-prompt/update-summary-prompt.input'
import { GetRecordingInput } from '../queries/get-recording/get-recording.input'
import { CreateRecordingCommand } from '../commands/create-recording/create-recording.command'
import { UpdateTranscriptionCommand } from '../commands/update-transcription/update-transcription.command'
import { DeleteRecordingCommand } from '../commands/delete-recording/delete-recording.command'
import { GenerateSummaryCommand } from '../commands/generate-summary/generate-summary.command'
import { UpdateSummaryPromptCommand } from '../commands/update-summary-prompt/update-summary-prompt.command'
import { GetRecordingsQuery } from '../queries/get-recordings/get-recordings.query'
import { GetRecordingQuery } from '../queries/get-recording/get-recording.query'
import { GetSummaryPromptQuery } from '../queries/get-summary-prompt/get-summary-prompt.query'
import { GetAITokenUsageQuery } from '../queries/get-ai-token-usage/get-ai-token-usage.query'
import type { IRecording } from '../interfaces/recording.interfaces'
import type { IAITokenUsage } from '../interfaces/ai-token-usage.interfaces'

@Resolver()
@UseGuards(JwtAuthGuard)
export class TranscriptionResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [RecordingType])
  async getRecordings(@CurrentUser() user: IJwtUser): Promise<IRecording[]> {
    return this.queryBus.execute<GetRecordingsQuery, IRecording[]>(
      new GetRecordingsQuery(user.id, user.role),
    )
  }

  @Query(() => RecordingType)
  async getRecording(
    @CurrentUser() user: IJwtUser,
    @Args('input') input: GetRecordingInput,
  ): Promise<IRecording> {
    return this.queryBus.execute<GetRecordingQuery, IRecording>(
      new GetRecordingQuery(input.id, user.id, user.role),
    )
  }

  @Query(() => String)
  async getSummaryPrompt(@CurrentUser() user: IJwtUser): Promise<string> {
    return this.queryBus.execute<GetSummaryPromptQuery, string>(
      new GetSummaryPromptQuery(user.id, user.role),
    )
  }

  @Query(() => AITokenUsageType)
  async getAITokenUsage(@CurrentUser() user: IJwtUser): Promise<IAITokenUsage> {
    return this.queryBus.execute<GetAITokenUsageQuery, IAITokenUsage>(
      new GetAITokenUsageQuery(user.id, user.role),
    )
  }

  @Mutation(() => RecordingType)
  async createRecording(
    @CurrentUser() user: IJwtUser,
    @Args('input') input: CreateRecordingInput,
  ): Promise<IRecording> {
    return this.commandBus.execute<CreateRecordingCommand, IRecording>(
      new CreateRecordingCommand(user.id, user.role, input),
    )
  }

  @Mutation(() => Boolean)
  async updateTranscription(
    @CurrentUser() user: IJwtUser,
    @Args('input') input: UpdateTranscriptionInput,
  ): Promise<boolean> {
    await this.commandBus.execute<UpdateTranscriptionCommand, void>(
      new UpdateTranscriptionCommand(user.id, user.role, input),
    )
    return true
  }

  @Mutation(() => Boolean)
  async deleteRecording(
    @CurrentUser() user: IJwtUser,
    @Args('input') input: DeleteRecordingInput,
  ): Promise<boolean> {
    await this.commandBus.execute<DeleteRecordingCommand, void>(
      new DeleteRecordingCommand(input.id, user.id, user.role),
    )
    return true
  }

  @Mutation(() => Boolean)
  async generateSummary(
    @CurrentUser() user: IJwtUser,
    @Args('input') input: GenerateSummaryInput,
  ): Promise<boolean> {
    await this.commandBus.execute<GenerateSummaryCommand, void>(
      new GenerateSummaryCommand(user.id, user.role, input.recordingId, input.prompt ?? null, input.language ?? null),
    )
    return true
  }

  @Mutation(() => Boolean)
  async updateSummaryPrompt(
    @CurrentUser() user: IJwtUser,
    @Args('input') input: UpdateSummaryPromptInput,
  ): Promise<boolean> {
    await this.commandBus.execute<UpdateSummaryPromptCommand, void>(
      new UpdateSummaryPromptCommand(user.id, user.role, input.prompt ?? null),
    )
    return true
  }
}
