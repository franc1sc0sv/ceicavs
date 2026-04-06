import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException, NotFoundException, ConflictException } from '../../../../common/errors'
import { IGroupRepository } from '../../interfaces/group.repository'
import { IUserRepository } from '../../interfaces/user.repository'
import { AddMemberToGroupCommand } from './add-member-to-group.command'

@CommandHandler(AddMemberToGroupCommand)
export class AddMemberToGroupHandler extends BaseCommandHandler<AddMemberToGroupCommand, void> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: AddMemberToGroupCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<void> {
    const ability = defineAbilityFor(command.user.role)

    if (!ability.can(Action.UPDATE, Subject.GROUP)) {
      throw new ForbiddenException()
    }

    const group = await this.groupRepository.findByIdWithMembers(command.groupId, tx)

    if (!group) {
      throw new NotFoundException('Group')
    }

    if (command.user.role === UserRole.TEACHER && group.createdBy !== command.user.id) {
      throw new ForbiddenException()
    }

    const userToAdd = await this.userRepository.findById(command.userId, tx)

    if (!userToAdd) {
      throw new NotFoundException('User')
    }

    const alreadyMember = group.members.some((m) => m.id === command.userId)

    if (alreadyMember) {
      throw new ConflictException('GroupMembership')
    }

    await this.groupRepository.addMember(command.groupId, command.userId, tx)
  }
}
