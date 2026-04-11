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
import type { IRecording } from '../../interfaces/recording.interfaces'
import { CreateRecordingCommand } from './create-recording.command'

@CommandHandler(CreateRecordingCommand)
export class CreateRecordingHandler extends BaseCommandHandler<CreateRecordingCommand, IRecording> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly recordingRepository: IRecordingRepository,
    private readonly transcriptionRepository: ITranscriptionRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: CreateRecordingCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<IRecording> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.CREATE, Subject.RECORDING)) {
      throw new ForbiddenException()
    }

    const recording = await this.recordingRepository.create(
      {
        userId: command.userId,
        name: command.input.name,
        duration: command.input.duration,
        audioUrl: command.input.audioUrl,
        cloudinaryPublicId: command.input.cloudinaryPublicId,
      },
      tx,
    )

    await this.transcriptionRepository.create(recording.id, tx)

    return { ...recording, transcriptionStatus: 'none' }
  }
}
