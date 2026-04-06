import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { ICommentRepository } from '../../interfaces/comment.repository'
import type { ICommentsPage } from '../../interfaces/comment.repository'
import { GetCommentsQuery } from './get-comments.query'

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler extends BaseQueryHandler<GetCommentsQuery, ICommentsPage> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly commentRepository: ICommentRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetCommentsQuery, tx: TxClient): Promise<ICommentsPage> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.COMMENT)) {
      throw new ForbiddenException()
    }

    return this.commentRepository.findPageByPost(query.postId, query.cursor, query.limit, query.userId, tx)
  }
}
