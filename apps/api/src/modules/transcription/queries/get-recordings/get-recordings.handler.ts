import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IRecordingRepository } from '../../interfaces/recording.repository'
import type { IRecording } from '../../interfaces/recording.interfaces'
import { GetRecordingsQuery } from './get-recordings.query'

@QueryHandler(GetRecordingsQuery)
export class GetRecordingsHandler extends BaseQueryHandler<GetRecordingsQuery, IRecording[]> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly recordingRepository: IRecordingRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetRecordingsQuery, tx: TxClient): Promise<IRecording[]> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.RECORDING)) {
      throw new ForbiddenException()
    }

    return this.recordingRepository.findByUserId(query.userId, tx)
  }
}
