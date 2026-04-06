import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { IUserRepository } from '../../interfaces/user.repository'
import type { IUser } from '../../interfaces/people.interfaces'
import { UpdateUserCommand } from './update-user.command'

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler extends BaseCommandHandler<UpdateUserCommand, IUser> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly userRepository: IUserRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: UpdateUserCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<IUser> {
    const ability = defineAbilityFor(command.user.role)

    if (!ability.can(Action.MANAGE, Subject.USER)) {
      throw new ForbiddenException()
    }

    const existing = await this.userRepository.findById(command.userId, tx)

    if (!existing) {
      throw new NotFoundException('User')
    }

    return this.userRepository.update(command.userId, command.data, tx)
  }
}
