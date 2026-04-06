import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { ICategoryRepository } from '../../interfaces/category.repository'
import type { ICategory } from '../../interfaces/blog.interfaces'
import { GetCategoriesQuery } from './get-categories.query'

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler extends BaseQueryHandler<GetCategoriesQuery, ICategory[]> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly categoryRepository: ICategoryRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetCategoriesQuery, tx: TxClient): Promise<ICategory[]> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.READ, Subject.POST)) {
      throw new ForbiddenException()
    }

    return this.categoryRepository.findAll(tx)
  }
}
