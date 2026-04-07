import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { IUserRepository } from '../../interfaces/user.repository'
import { UserDeletedEvent } from '../../events/user-deleted.event'
import { DeleteUserCommand } from './delete-user.command'

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler extends BaseCommandHandler<DeleteUserCommand, void> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly userRepository: IUserRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: DeleteUserCommand,
    tx: TxClient,
    events: IDomainEvent[],
  ): Promise<void> {
    const ability = defineAbilityFor(command.user.role)

    if (!ability.can(Action.MANAGE, Subject.USER)) {
      throw new ForbiddenException()
    }

    const existing = await this.userRepository.findById(command.userId, tx)

    if (!existing) {
      throw new NotFoundException('User')
    }

    await this.userRepository.softDelete(command.userId, tx)

    events.push(new UserDeletedEvent(command.userId, command.user.id, command.user.role))
  }
}
