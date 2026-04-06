import type { UserRole } from '@ceicavs/shared'

export class GetExportStatusQuery {
  constructor(
    public readonly jobId: string,
    public readonly role: UserRole,
  ) {}
}
