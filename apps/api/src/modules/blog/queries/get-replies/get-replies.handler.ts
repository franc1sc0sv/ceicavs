import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { ICommentRepository } from '../../interfaces/comment.repository'
import type { ICommentsPage } from '../../interfaces/comment.repository'
import { GetRepliesQuery } from './get-replies.query'

@QueryHandler(GetRepliesQuery)
export class GetRepliesHandler extends BaseQueryHandler<GetRepliesQuery, ICommentsPage> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly commentRepository: ICommentRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetRepliesQuery, tx: TxClient): Promise<ICommentsPage> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.COMMENT)) {
      throw new ForbiddenException()
    }

    return this.commentRepository.findPageByParent(query.parentId, query.cursor, query.limit, query.userId, tx)
  }
}
