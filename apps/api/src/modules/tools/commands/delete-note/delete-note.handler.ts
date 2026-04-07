import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { INoteRepository } from '../../interfaces/note.repository'
import { DeleteNoteCommand } from './delete-note.command'

@CommandHandler(DeleteNoteCommand)
export class DeleteNoteHandler extends BaseCommandHandler<DeleteNoteCommand, void> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly noteRepository: INoteRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(command: DeleteNoteCommand, tx: TxClient, _events: IDomainEvent[]): Promise<void> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.DELETE, Subject.NOTE)) {
      throw new ForbiddenException()
    }

    const note = await this.noteRepository.findById(command.noteId, tx)

    if (!note || note.userId !== command.userId) {
      throw new ForbiddenException()
    }

    await this.noteRepository.softDelete(command.noteId, tx)
  }
}
