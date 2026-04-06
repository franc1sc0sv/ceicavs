import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IPostRepository } from '../../interfaces/post.repository'
import type { IPostWithRelations } from '../../interfaces/blog.interfaces'
import { GetMyDraftsQuery } from './get-my-drafts.query'

@QueryHandler(GetMyDraftsQuery)
export class GetMyDraftsHandler extends BaseQueryHandler<GetMyDraftsQuery, IPostWithRelations[]> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly postRepository: IPostRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetMyDraftsQuery, tx: TxClient): Promise<IPostWithRelations[]> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.POST)) {
      throw new ForbiddenException()
    }

    return this.postRepository.findMany({ authorId: query.userId }, tx)
  }
}
