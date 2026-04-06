import type { IDomainEvent } from '../../../common/cqrs'

export class AttendanceSubmittedEvent implements IDomainEvent {
  readonly eventName = 'attendance.submitted'
  readonly occurredAt = new Date()

  constructor(
    public readonly groupId: string,
    public readonly submittedBy: string,
    public readonly date: string,
  ) {}
}
