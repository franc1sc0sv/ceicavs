import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IUserRepository } from '../../interfaces/user.repository'
import type { IUser } from '../../interfaces/people.interfaces'
import { UserCreatedEvent } from '../../events/user-created.event'
import { CreateUserCommand } from './create-user.command'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler extends BaseCommandHandler<CreateUserCommand, IUser> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly userRepository: IUserRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: CreateUserCommand,
    tx: TxClient,
    events: IDomainEvent[],
  ): Promise<IUser> {
    const ability = defineAbilityFor(command.user.role)

    if (!ability.can(Action.MANAGE, Subject.USER)) {
      throw new ForbiddenException()
    }

    const user = await this.userRepository.create(command.data, tx)

    events.push(new UserCreatedEvent(user.id, user.role))

    return user
  }
}
