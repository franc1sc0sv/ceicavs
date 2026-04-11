import { CommandHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseCommandHandler } from '../../../../common/cqrs'
import type { IDomainEvent } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { IEventEmitter } from '../../../../common/events/event-emitter.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { ITranscriptionUserRepository } from '../../interfaces/user.repository'
import { UpdateSummaryPromptCommand } from './update-summary-prompt.command'

@CommandHandler(UpdateSummaryPromptCommand)
export class UpdateSummaryPromptHandler extends BaseCommandHandler<UpdateSummaryPromptCommand, void> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly userRepository: ITranscriptionUserRepository,
  ) {
    super(db, eventEmitter)
  }

  protected async handle(command: UpdateSummaryPromptCommand, tx: TxClient, _events: IDomainEvent[]): Promise<void> {
    const ability = defineAbilityFor(command.role)

    if (!ability.can(Action.TRANSCRIBE, Subject.RECORDING)) {
      throw new ForbiddenException()
    }

    await this.userRepository.updateSummaryPrompt(command.userId, command.prompt, tx)
  }
}
