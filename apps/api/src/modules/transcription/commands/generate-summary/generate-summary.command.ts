import type { UserRole } from '@ceicavs/shared'

export class GenerateSummaryCommand {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
    public readonly recordingId: string,
    public readonly prompt: string | null = null,
  ) {}
}
