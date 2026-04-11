import type { UserRole } from '@ceicavs/shared'

export class UpdateSummaryPromptCommand {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
    public readonly prompt: string | null,
  ) {}
}
