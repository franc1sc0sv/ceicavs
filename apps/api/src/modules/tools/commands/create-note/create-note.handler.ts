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
import { CreateNoteCommand } from './create-note.command'

@CommandHandler(CreateNoteCommand)
export class CreateNoteHandler extends BaseCommandHandler<CreateNoteCommand, INote> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly noteRepository: INoteRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(command: CreateNoteCommand, tx: TxClient, _events: IDomainEvent[]): Promise<INote> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.CREATE, Subject.NOTE)) {
      throw new ForbiddenException()
    }

    return this.noteRepository.create(command.userId, command.content, tx)
  }
}
