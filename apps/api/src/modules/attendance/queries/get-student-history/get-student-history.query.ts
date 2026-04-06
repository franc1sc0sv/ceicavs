import type { UserRole } from '@ceicavs/shared'

export class GetStudentHistoryQuery {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
