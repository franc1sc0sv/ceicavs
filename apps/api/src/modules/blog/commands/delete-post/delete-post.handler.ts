import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { IPostRepository } from '../../interfaces/post.repository'
import { DeletePostCommand } from './delete-post.command'

@CommandHandler(DeletePostCommand)
export class DeletePostHandler extends BaseCommandHandler<DeletePostCommand, boolean> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly postRepository: IPostRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: DeletePostCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<boolean> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.DELETE, Subject.POST)) {
      throw new ForbiddenException()
    }

    const post = await this.postRepository.findById(command.postId, tx)

    if (!post) {
      throw new NotFoundException('Post')
    }

    const isAdmin = command.role === UserRole.ADMIN
    const isAuthorDraft = post.authorId === command.userId && post.status === 'draft'

    if (!isAdmin && !isAuthorDraft) {
      throw new ForbiddenException()
    }

    await this.postRepository.softDelete(command.postId, tx)

    return true
  }
}
