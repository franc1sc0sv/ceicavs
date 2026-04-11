import type { UserRole } from '@ceicavs/shared'
import type { UpdateTranscriptionInput } from './update-transcription.input'

export class UpdateTranscriptionCommand {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
    public readonly input: UpdateTranscriptionInput,
  ) {}
}
