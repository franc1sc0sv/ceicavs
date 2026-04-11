import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IRecordingRepository } from '../../interfaces/recording.repository'
import { ITranscriptionRepository } from '../../interfaces/transcription.repository'
import type { ITranscriptSegment } from '../../interfaces/recording.interfaces'
import { UpdateTranscriptionCommand } from './update-transcription.command'

@CommandHandler(UpdateTranscriptionCommand)
export class UpdateTranscriptionHandler extends BaseCommandHandler<UpdateTranscriptionCommand, void> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly recordingRepository: IRecordingRepository,
    private readonly transcriptionRepository: ITranscriptionRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: UpdateTranscriptionCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<void> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.TRANSCRIBE, Subject.RECORDING)) {
      throw new ForbiddenException()
    }

    const segments = JSON.parse(command.input.segments) as ITranscriptSegment[]

    await this.transcriptionRepository.update(
      {
        recordingId: command.input.recordingId,
        fullTranscript: command.input.fullTranscript,
        segments,
        summary: command.input.summary ?? null,
      },
      tx,
    )

    await this.recordingRepository.updateTranscriptionStatus(
      command.input.recordingId,
      'completed',
      tx,
    )
  }
}
