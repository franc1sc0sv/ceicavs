import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { IAttendanceRepository } from './repositories/attendance.repository.abstract'
import { AttendanceRepository } from './repositories/attendance.repository'
import { AttendanceResolver } from './resolvers/attendance.resolver'
import { GetGroupsHandler } from './queries/get-groups/get-groups.handler'
import { GetRosterHandler } from './queries/get-roster/get-roster.handler'
import { GetAttendanceReportHandler } from './queries/get-attendance-report/get-attendance-report.handler'
import { GetStudentHistoryHandler } from './queries/get-student-history/get-student-history.handler'
import { GetStudentSummaryHandler } from './queries/get-student-summary/get-student-summary.handler'
import { GetExportStatusHandler } from './queries/get-export-status/get-export-status.handler'
import { RecordAttendanceHandler } from './commands/record-attendance/record-attendance.handler'
import { ExportAttendanceHandler } from './commands/export-attendance/export-attendance.handler'

@Module({
  imports: [CqrsModule],
  providers: [
    AttendanceResolver,
    { provide: IAttendanceRepository, useClass: AttendanceRepository },
    GetGroupsHandler,
    GetRosterHandler,
    GetAttendanceReportHandler,
    GetStudentHistoryHandler,
    GetStudentSummaryHandler,
    GetExportStatusHandler,
    RecordAttendanceHandler,
    ExportAttendanceHandler,
  ],
})
export class AttendanceModule {}
