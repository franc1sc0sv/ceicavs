import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { IGroupRepository } from '../../interfaces/group.repository'
import { DeleteGroupCommand } from './delete-group.command'

@CommandHandler(DeleteGroupCommand)
export class DeleteGroupHandler extends BaseCommandHandler<DeleteGroupCommand, void> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly groupRepository: IGroupRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: DeleteGroupCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<void> {
    const ability = defineAbilityFor(command.user.role)

    if (!ability.can(Action.DELETE, Subject.GROUP)) {
      throw new ForbiddenException()
    }

    const group = await this.groupRepository.findById(command.groupId, tx)

    if (!group) {
      throw new NotFoundException('Group')
    }

    if (command.user.role === UserRole.TEACHER && group.createdBy !== command.user.id) {
      throw new ForbiddenException()
    }

    await this.groupRepository.softDelete(command.groupId, tx)
  }
}
