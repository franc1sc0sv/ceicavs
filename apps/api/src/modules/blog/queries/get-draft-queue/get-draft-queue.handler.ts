import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IPostRepository } from '../../interfaces/post.repository'
import type { IPostWithRelations } from '../../interfaces/blog.interfaces'
import { PostStatus } from '../../types/post-status.enum'
import { GetDraftQueueQuery } from './get-draft-queue.query'

@QueryHandler(GetDraftQueueQuery)
export class GetDraftQueueHandler extends BaseQueryHandler<GetDraftQueueQuery, IPostWithRelations[]> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly postRepository: IPostRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetDraftQueueQuery, tx: TxClient): Promise<IPostWithRelations[]> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.APPROVE, Subject.POST)) {
      throw new ForbiddenException()
    }

    return this.postRepository.findMany({ status: PostStatus.pending }, tx)
  }
}
