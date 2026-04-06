import { randomUUID } from 'crypto'
import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import type { IExportJobResult } from '../../interfaces/attendance.interfaces'
import { ExportAttendanceCommand } from './export-attendance.command'

@CommandHandler(ExportAttendanceCommand)
export class ExportAttendanceHandler extends BaseCommandHandler<
  ExportAttendanceCommand,
  IExportJobResult
> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: ExportAttendanceCommand,
    _tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<IExportJobResult> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.EXPORT, Subject.ATTENDANCE_RECORD)) {
      throw new ForbiddenException()
    }

    return { jobId: randomUUID() }
  }
}
