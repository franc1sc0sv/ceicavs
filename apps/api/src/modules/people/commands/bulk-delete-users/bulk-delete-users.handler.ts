import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IUserRepository } from '../../interfaces/user.repository'
import { BulkDeleteUsersCommand } from './bulk-delete-users.command'

@CommandHandler(BulkDeleteUsersCommand)
export class BulkDeleteUsersHandler extends BaseCommandHandler<BulkDeleteUsersCommand, void> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly userRepository: IUserRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: BulkDeleteUsersCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<void> {
    const ability = defineAbilityFor(command.user.role)

    if (!ability.can(Action.MANAGE, Subject.USER)) {
      throw new ForbiddenException()
    }

    await this.userRepository.softDeleteMany(command.ids, tx)
  }
}
