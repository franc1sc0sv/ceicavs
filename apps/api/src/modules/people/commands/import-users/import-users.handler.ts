import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IUserRepository } from '../../interfaces/user.repository'
import type { IImportUsersResult } from '../../interfaces/people.interfaces'
import { UserCreatedEvent } from '../../events/user-created.event'
import { ImportUsersCommand } from './import-users.command'

@CommandHandler(ImportUsersCommand)
export class ImportUsersHandler extends BaseCommandHandler<ImportUsersCommand, IImportUsersResult> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly userRepository: IUserRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: ImportUsersCommand,
    tx: TxClient,
    events: IDomainEvent[],
  ): Promise<IImportUsersResult> {
    const ability = defineAbilityFor(command.user.role)

    if (!ability.can(Action.MANAGE, Subject.USER)) {
      throw new ForbiddenException()
    }

    let created = 0
    let skipped = 0
    const errors: string[] = []

    for (const row of command.rows) {
      const roleValue = row.role as string

      if (!Object.values(UserRole).includes(roleValue as UserRole)) {
        errors.push(`Row for ${row.email}: invalid role "${row.role}"`)
        skipped++
        continue
      }

      try {
        const user = await this.userRepository.create(
          {
            name: row.name,
            email: row.email,
            password: `${row.email}-import`,
            role: roleValue as UserRole,
          },
          tx,
        )

        events.push(new UserCreatedEvent(user.id, user.role))
        created++
      } catch {
        errors.push(`Row for ${row.email}: could not be created`)
        skipped++
      }
    }

    return { created, skipped, errors }
  }
}
