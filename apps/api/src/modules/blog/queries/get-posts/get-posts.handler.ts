import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject, UserRole } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IPostRepository } from '../../interfaces/post.repository'
import type { IPostWithRelations } from '../../interfaces/blog.interfaces'
import { GetPostsQuery } from './get-posts.query'

@QueryHandler(GetPostsQuery)
export class GetPostsHandler extends BaseQueryHandler<GetPostsQuery, IPostWithRelations[]> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly postRepository: IPostRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetPostsQuery, tx: TxClient): Promise<IPostWithRelations[]> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.POST)) {
      throw new ForbiddenException()
    }

    const isStudent = query.role === UserRole.STUDENT

    const filters = isStudent
      ? { ...query.filters, status: 'published' as const }
      : query.filters

    return this.postRepository.findMany(filters, tx)
  }
}
