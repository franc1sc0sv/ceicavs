import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { IRecordingRepository } from '../../interfaces/recording.repository'
import type { IRecording } from '../../interfaces/recording.interfaces'
import { GetRecordingQuery } from './get-recording.query'

@QueryHandler(GetRecordingQuery)
export class GetRecordingHandler extends BaseQueryHandler<GetRecordingQuery, IRecording> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly recordingRepository: IRecordingRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetRecordingQuery, tx: TxClient): Promise<IRecording> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.RECORDING)) {
      throw new ForbiddenException()
    }

    const recording = await this.recordingRepository.findById(query.id, tx)

    if (!recording) {
      throw new NotFoundException('Recording')
    }

    if (recording.userId !== query.userId) {
      throw new ForbiddenException()
    }

    return recording
  }
}
