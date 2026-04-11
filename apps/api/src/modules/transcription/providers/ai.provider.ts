export interface IAICompletionParams {
  systemPrompt: string
  userMessage: string
}

export abstract class IAIService {
  abstract createCompletion(params: IAICompletionParams): Promise<string>
}
