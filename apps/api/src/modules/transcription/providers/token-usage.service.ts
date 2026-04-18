import { Injectable } from '@nestjs/common'

interface GroqUsageState {
  remaining: number
  limit: number
}

interface GeminiUsageState {
  usedToday: number
  dayStart: Date
}

const GEMINI_DAILY_LIMIT = 1_500_000

@Injectable()
export class TokenUsageService {
  private groq: GroqUsageState = { remaining: 0, limit: 0 }
  private gemini: GeminiUsageState = { usedToday: 0, dayStart: new Date() }

  updateGroq(remaining: number, limit: number): void {
    this.groq = { remaining, limit }
  }

  updateGemini(tokensUsed: number): void {
    const now = new Date()
    if (now.toDateString() !== this.gemini.dayStart.toDateString()) {
      this.gemini = { usedToday: tokensUsed, dayStart: now }
    } else {
      this.gemini.usedToday += tokensUsed
    }
  }

  getGroqUsage(): { remaining: number; limit: number; percentRemaining: number } {
    const { remaining, limit } = this.groq
    const percentRemaining = limit > 0 ? Math.round((remaining / limit) * 100) : 0
    return { remaining, limit, percentRemaining }
  }

  getGeminiUsage(): { usedToday: number; dailyLimit: number; percentRemaining: number } {
    const usedToday = this.gemini.usedToday
    const percentRemaining = Math.max(0, Math.round(((GEMINI_DAILY_LIMIT - usedToday) / GEMINI_DAILY_LIMIT) * 100))
    return { usedToday, dailyLimit: GEMINI_DAILY_LIMIT, percentRemaining }
  }
}
