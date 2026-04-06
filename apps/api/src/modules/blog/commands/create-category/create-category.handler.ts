import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { ICategoryRepository } from '../../interfaces/category.repository'
import type { ICategory } from '../../interfaces/blog.interfaces'
import { CreateCategoryCommand } from './create-category.command'

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler extends BaseCommandHandler<CreateCategoryCommand, ICategory> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly categoryRepository: ICategoryRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: CreateCategoryCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<ICategory> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.MANAGE, Subject.CATEGORY)) {
      throw new ForbiddenException()
    }

    return this.categoryRepository.create(command.name, tx)
  }
}
