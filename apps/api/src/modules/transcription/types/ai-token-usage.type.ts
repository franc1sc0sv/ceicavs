import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class GroqTokenUsageType {
  @Field(() => Int)
  remaining: number

  @Field(() => Int)
  limit: number

  @Field(() => Int)
  percentRemaining: number
}

@ObjectType()
export class GeminiTokenUsageType {
  @Field(() => Int)
  usedToday: number

  @Field(() => Int)
  dailyLimit: number

  @Field(() => Int)
  percentRemaining: number
}

@ObjectType()
export class AITokenUsageType {
  @Field(() => GroqTokenUsageType)
  groq: GroqTokenUsageType

  @Field(() => GeminiTokenUsageType)
  gemini: GeminiTokenUsageType
}
