import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException, NotFoundException } from '../../../../common/errors'
import { ICategoryRepository } from '../../interfaces/category.repository'
import type { ICategory } from '../../interfaces/blog.interfaces'
import { UpdateCategoryCommand } from './update-category.command'

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler extends BaseCommandHandler<UpdateCategoryCommand, ICategory> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly categoryRepository: ICategoryRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: UpdateCategoryCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<ICategory> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.MANAGE, Subject.CATEGORY)) {
      throw new ForbiddenException()
    }

    const category = await this.categoryRepository.findById(command.categoryId, tx)

    if (!category) {
      throw new NotFoundException('Category')
    }

    return this.categoryRepository.update(command.categoryId, command.name, tx)
  }
}
