import type { IDomainEvent } from '../../../common/cqrs'
import type { UserRole } from '@ceicavs/shared'

export class AttendanceSubmittedEvent implements IDomainEvent {
  readonly eventName = 'attendance.submitted'
  readonly occurredAt = new Date()

  constructor(
    public readonly groupId: string,
    public readonly submittedBy: string,
    public readonly date: string,
    public readonly actorRole: UserRole,
  ) {}
}
