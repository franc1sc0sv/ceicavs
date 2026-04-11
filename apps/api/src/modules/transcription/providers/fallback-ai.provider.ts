import { Injectable } from '@nestjs/common'
import { IAIService, IAICompletionParams } from './ai.provider'
import { GroqService } from './groq.provider'
import { GeminiService } from './gemini.provider'

function isRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const status = (error as { status?: number }).status
  return status === 429
}

@Injectable()
export class FallbackAIService implements IAIService {
  constructor(
    private readonly groq: GroqService,
    private readonly gemini: GeminiService,
  ) {}

  async createCompletion(params: IAICompletionParams): Promise<string> {
    try {
      return await this.groq.createCompletion(params)
    } catch (error: unknown) {
      if (isRateLimitError(error)) {
        return this.gemini.createCompletion(params)
      }
      throw error
    }
  }
}
