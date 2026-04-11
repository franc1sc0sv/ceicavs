import { Injectable } from '@nestjs/common'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { IAIService, IAICompletionParams } from './ai.provider'

const GEMINI_MODEL = 'gemini-2.0-flash' as const

@Injectable()
export class GeminiService implements IAIService {
  private readonly client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

  async createCompletion({ systemPrompt, userMessage }: IAICompletionParams): Promise<string> {
    const model = this.client.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
    })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 8192,
      },
    })

    const content = result.response.text()
    if (!content) throw new Error('Empty response from Gemini')
    return content
  }
}
