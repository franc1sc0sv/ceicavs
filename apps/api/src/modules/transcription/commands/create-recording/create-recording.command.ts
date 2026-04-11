import type { UserRole } from '@ceicavs/shared'
import type { CreateRecordingInput } from './create-recording.input'

export class CreateRecordingCommand {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
    public readonly input: CreateRecordingInput,
  ) {}
}
