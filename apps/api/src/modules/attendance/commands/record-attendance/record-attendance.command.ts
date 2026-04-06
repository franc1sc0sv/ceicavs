import type { UserRole } from '@ceicavs/shared'
import type { IRecordAttendanceItem } from '../../interfaces/attendance.interfaces'

export class RecordAttendanceCommand {
  constructor(
    public readonly groupId: string,
    public readonly date: string,
    public readonly records: IRecordAttendanceItem[],
    public readonly submittedBy: string,
    public readonly role: UserRole,
  ) {}
}
