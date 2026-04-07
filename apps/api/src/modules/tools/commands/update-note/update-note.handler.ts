import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { INoteRepository } from '../../interfaces/note.repository'
import type { INote } from '../../interfaces/note.interfaces'
import { UpdateNoteCommand } from './update-note.command'

@CommandHandler(UpdateNoteCommand)
export class UpdateNoteHandler extends BaseCommandHandler<UpdateNoteCommand, INote> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly noteRepository: INoteRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(command: UpdateNoteCommand, tx: TxClient, _events: IDomainEvent[]): Promise<INote> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.UPDATE, Subject.NOTE)) {
      throw new ForbiddenException()
    }

    const note = await this.noteRepository.findById(command.noteId, tx)

    if (!note || note.userId !== command.userId) {
      throw new ForbiddenException()
    }

    return this.noteRepository.update(command.noteId, command.content, tx)
  }
}
