import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { ITranscriptionUserRepository } from '../../interfaces/user.repository'
import { DEFAULT_SUMMARY_INSTRUCTIONS } from '../../prompts/generate-summary.prompt'
import { GetSummaryPromptQuery } from './get-summary-prompt.query'

@QueryHandler(GetSummaryPromptQuery)
export class GetSummaryPromptHandler extends BaseQueryHandler<GetSummaryPromptQuery, string> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly userRepository: ITranscriptionUserRepository,
  ) {
    super(db)
  }

  protected async handle(query: GetSummaryPromptQuery, tx: TxClient): Promise<string> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.TRANSCRIBE, Subject.RECORDING)) {
      throw new ForbiddenException()
    }

    const prompt = await this.userRepository.findSummaryPrompt(query.userId, tx)

    return prompt ?? DEFAULT_SUMMARY_INSTRUCTIONS
  }
}
