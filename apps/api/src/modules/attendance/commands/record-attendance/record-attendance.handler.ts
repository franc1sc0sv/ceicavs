import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IAttendanceRepository } from '../../repositories/attendance.repository.abstract'
import { AttendanceSubmittedEvent } from '../../events/attendance-submitted.event'
import { RecordAttendanceCommand } from './record-attendance.command'

@CommandHandler(RecordAttendanceCommand)
export class RecordAttendanceHandler extends BaseCommandHandler<RecordAttendanceCommand, void> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly attendanceRepository: IAttendanceRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: RecordAttendanceCommand,
    tx: TxClient,
    events: IDomainEvent[],
  ): Promise<void> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.MANAGE, Subject.ATTENDANCE_RECORD)) {
      throw new ForbiddenException()
    }

    await this.attendanceRepository.upsertAttendanceRecords(
      command.groupId,
      command.date,
      command.records,
      tx,
    )

    await this.attendanceRepository.upsertSubmission(
      command.groupId,
      command.submittedBy,
      command.date,
      tx,
    )

    events.push(
      new AttendanceSubmittedEvent(command.groupId, command.submittedBy, command.date, command.role),
    )
  }
}
