export interface IGroqTokenUsage {
  remaining: number
  limit: number
  percentRemaining: number
}

export interface IGeminiTokenUsage {
  usedToday: number
  dailyLimit: number
  percentRemaining: number
}

export interface IAITokenUsage {
  groq: IGroqTokenUsage
  gemini: IGeminiTokenUsage
}
