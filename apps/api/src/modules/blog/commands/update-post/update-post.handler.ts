import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { PostStatus } from '../../types/post-status.enum'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { IPostRepository } from '../../interfaces/post.repository'
import type { IPostWithRelations } from '../../interfaces/blog.interfaces'
import { UpdatePostCommand } from './update-post.command'

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler extends BaseCommandHandler<UpdatePostCommand, IPostWithRelations> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly postRepository: IPostRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: UpdatePostCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<IPostWithRelations> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.UPDATE, Subject.POST)) {
      throw new ForbiddenException()
    }

    const post = await this.postRepository.findById(command.postId, tx)

    if (!post) {
      throw new NotFoundException('Post')
    }

    const isAdmin = command.role === UserRole.ADMIN
    const isAuthor = post.authorId === command.userId

    if (!isAdmin && !isAuthor) {
      throw new ForbiddenException()
    }

    await this.postRepository.update(command.postId, command.data, tx)

    if (command.data.publish === true) {
      const isTeacherOrAdmin = command.role === UserRole.ADMIN || command.role === UserRole.TEACHER
      if (isTeacherOrAdmin) {
        await this.postRepository.updateStatus(command.postId, PostStatus.published, undefined, tx)
      } else {
        if (!ability.can(Action.SUBMIT, Subject.POST)) throw new ForbiddenException()
        await this.postRepository.updateStatus(command.postId, PostStatus.pending, undefined, tx)
      }
    }

    const posts = await this.postRepository.findMany({ authorId: post.authorId }, tx)
    const fullPost = posts.find((p) => p.id === command.postId)

    if (!fullPost) {
      throw new NotFoundException('Post')
    }

    return fullPost
  }
}
