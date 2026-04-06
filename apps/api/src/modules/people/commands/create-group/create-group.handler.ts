import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IGroupRepository } from '../../interfaces/group.repository'
import type { IGroup } from '../../interfaces/people.interfaces'
import { CreateGroupCommand } from './create-group.command'

@CommandHandler(CreateGroupCommand)
export class CreateGroupHandler extends BaseCommandHandler<CreateGroupCommand, IGroup> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly groupRepository: IGroupRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: CreateGroupCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<IGroup> {
    const ability = defineAbilityFor(command.user.role)

    if (!ability.can(Action.CREATE, Subject.GROUP)) {
      throw new ForbiddenException()
    }

    return this.groupRepository.create(command.data, command.user.id, tx)
  }
}
