import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { INoteRepository } from '../../interfaces/note.repository'
import type { INote } from '../../interfaces/note.interfaces'
import { GetNotesQuery } from './get-notes.query'

@QueryHandler(GetNotesQuery)
export class GetNotesHandler extends BaseQueryHandler<GetNotesQuery, INote[]> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly noteRepository: INoteRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetNotesQuery, tx: TxClient): Promise<INote[]> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.MANAGE, Subject.NOTE)) {
      throw new ForbiddenException()
    }

    return this.noteRepository.findByUserId(query.userId, tx)
  }
}
