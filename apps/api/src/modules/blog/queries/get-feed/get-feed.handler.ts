import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IPostRepository } from '../../interfaces/post.repository'
import type { IPostsPage } from '../../interfaces/post.repository'
import { GetFeedQuery } from './get-feed.query'

@QueryHandler(GetFeedQuery)
export class GetFeedHandler extends BaseQueryHandler<GetFeedQuery, IPostsPage> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly postRepository: IPostRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetFeedQuery, tx: TxClient): Promise<IPostsPage> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.POST)) {
      throw new ForbiddenException()
    }

    return this.postRepository.findFeed(query.filters, query.cursor, query.limit, query.userId, tx)
  }
}
