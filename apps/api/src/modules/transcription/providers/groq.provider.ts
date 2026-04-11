import { Injectable } from '@nestjs/common'
import Groq from 'groq-sdk'
import { IAIService, IAICompletionParams } from './ai.provider'

const GROQ_MODEL = 'llama-3.3-70b-versatile' as const

@Injectable()
export class GroqService implements IAIService {
  private readonly client = new Groq({ apiKey: process.env.GROQ_API_KEY })

  async createCompletion({ systemPrompt, userMessage }: IAICompletionParams): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 5120,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) throw new Error('Empty response from Groq')
    return content
  }
}
