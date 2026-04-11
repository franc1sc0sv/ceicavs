import type { UserRole } from '@ceicavs/shared'

export class GetSummaryPromptQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
