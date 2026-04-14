import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { IPostRepository } from '../../interfaces/post.repository'
import type { IPostWithRelations } from '../../interfaces/blog.interfaces'
import { PostStatus } from '../../types/post-status.enum'
import { PostCreatedEvent } from '../../events/post-created.event'
import { CreatePostCommand } from './create-post.command'

@CommandHandler(CreatePostCommand)
export class CreatePostHandler extends BaseCommandHandler<CreatePostCommand, IPostWithRelations> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly postRepository: IPostRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: CreatePostCommand,
    tx: TxClient,
    events: IDomainEvent[],
  ): Promise<IPostWithRelations> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.CREATE, Subject.POST)) {
      throw new ForbiddenException()
    }

    const isTeacherOrAdmin =
      command.role === UserRole.ADMIN || command.role === UserRole.TEACHER

    let status: PostStatus
    if (!command.data.publish) {
      status = PostStatus.draft
    } else if (isTeacherOrAdmin) {
      status = PostStatus.published
    } else {
      if (!ability.can(Action.SUBMIT, Subject.POST)) throw new ForbiddenException()
      status = PostStatus.pending
    }

    const post = await this.postRepository.create(command.data, command.userId, status, tx)

    events.push(new PostCreatedEvent(post.id, command.userId, status, command.role))

    const posts = await this.postRepository.findMany({ authorId: command.userId }, tx)
    const fullPost = posts.find((p) => p.id === post.id)

    if (!fullPost) {
      throw new NotFoundException('Post')
    }

    return fullPost
  }
}
