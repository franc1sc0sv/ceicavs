import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { TokenUsageService } from '../../providers/token-usage.service'
import type { IAITokenUsage } from '../../interfaces/ai-token-usage.interfaces'
import { GetAITokenUsageQuery } from './get-ai-token-usage.query'

@QueryHandler(GetAITokenUsageQuery)
export class GetAITokenUsageHandler extends BaseQueryHandler<GetAITokenUsageQuery, IAITokenUsage> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly tokenUsage: TokenUsageService,
  ) {
    super(db)
  }

  protected async handle(query: GetAITokenUsageQuery, _tx: TxClient): Promise<IAITokenUsage> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.TRANSCRIBE, Subject.RECORDING)) {
      throw new ForbiddenException()
    }

    return {
      groq: this.tokenUsage.getGroqUsage(),
      gemini: this.tokenUsage.getGeminiUsage(),
    }
  }
}
