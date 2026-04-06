import type { RepositoryMethod } from '../../../common/cqrs'
import type {
  IAttendanceGroup,
  IGroupRoster,
  IRecordAttendanceItem,
  IStudentHistoryRecord,
  IStudentReport,
  IStudentSummary,
} from '../interfaces/attendance.interfaces'

export abstract class IAttendanceRepository {
  abstract findGroupsForAdmin: RepositoryMethod<[], IAttendanceGroup[]>
  abstract findGroupsForTeacher: RepositoryMethod<[userId: string], IAttendanceGroup[]>
  abstract findRoster: RepositoryMethod<[groupId: string, date: string], IGroupRoster>
  abstract findAttendanceReport: RepositoryMethod<
    [groupId: string, dateRange: { from: Date; to: Date }],
    IStudentReport[]
  >
  abstract findStudentHistory: RepositoryMethod<[userId: string], IStudentHistoryRecord[]>
  abstract findStudentSummary: RepositoryMethod<[userId: string], IStudentSummary>
  abstract upsertAttendanceRecords: RepositoryMethod<
    [groupId: string, date: string, records: IRecordAttendanceItem[]],
    void
  >
  abstract upsertSubmission: RepositoryMethod<
    [groupId: string, submittedBy: string, date: string],
    void
  >
}
