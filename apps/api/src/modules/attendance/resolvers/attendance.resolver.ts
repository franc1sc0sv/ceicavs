import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'
import type { IJwtUser } from '../../../common/types'
import { AttendanceGroupType } from '../types/attendance-group.type'
import { GroupRosterType } from '../types/group-roster.type'
import { StudentReportType } from '../types/student-report.type'
import { StudentHistoryRecordType } from '../types/student-history-record.type'
import { StudentSummaryType } from '../types/student-summary.type'
import { ExportJobType } from '../types/export-job.type'
import { ExportStatusType } from '../types/export-status.type'
import { RecordAttendanceInput } from '../commands/record-attendance/record-attendance.input'
import { ExportAttendanceInput } from '../types/export-attendance.input'
import { AttendanceReportByRangeInput } from '../types/attendance-report-by-range.input'
import { AttendanceReportResultType } from '../types/attendance-report-result.type'
import { GetGroupsQuery } from '../queries/get-groups/get-groups.query'
import { GetRosterQuery } from '../queries/get-roster/get-roster.query'
import { GetAttendanceReportQuery } from '../queries/get-attendance-report/get-attendance-report.query'
import { GetAttendanceReportByRangeQuery } from '../queries/get-attendance-report-by-range/get-attendance-report-by-range.query'
import { GetStudentHistoryQuery } from '../queries/get-student-history/get-student-history.query'
import { GetStudentSummaryQuery } from '../queries/get-student-summary/get-student-summary.query'
import { GetExportStatusQuery } from '../queries/get-export-status/get-export-status.query'
import { RecordAttendanceCommand } from '../commands/record-attendance/record-attendance.command'
import { ExportAttendanceCommand } from '../commands/export-attendance/export-attendance.command'
import { ReportPeriod } from '../enums/report-period.enum'
import type {
  IAttendanceGroup,
  IAttendanceReportResult,
  IExportJobResult,
  IExportStatus,
  IGroupRoster,
  IStudentHistoryRecord,
  IStudentReport,
  IStudentSummary,
} from '../interfaces/attendance.interfaces'

@Resolver()
@UseGuards(JwtAuthGuard)
export class AttendanceResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [AttendanceGroupType])
  async attendanceGroups(@CurrentUser() user: IJwtUser): Promise<IAttendanceGroup[]> {
    return this.queryBus.execute<GetGroupsQuery, IAttendanceGroup[]>(
      new GetGroupsQuery(user.id, user.role),
    )
  }

  @Query(() => GroupRosterType)
  async attendanceRoster(
    @Args('groupId', { type: () => String }) groupId: string,
    @Args('date', { type: () => String }) date: string,
    @CurrentUser() user: IJwtUser,
  ): Promise<IGroupRoster> {
    return this.queryBus.execute<GetRosterQuery, IGroupRoster>(
      new GetRosterQuery(groupId, date, user.role),
    )
  }

  @Query(() => [StudentReportType])
  async attendanceReport(
    @Args('groupId', { type: () => String }) groupId: string,
    @Args('period', { type: () => ReportPeriod }) period: ReportPeriod,
    @Args('date', { type: () => String, nullable: true }) date: string | undefined,
    @CurrentUser() user: IJwtUser,
  ): Promise<IStudentReport[]> {
    const anchorDate = date ?? new Date().toLocaleDateString('en-CA')
    return this.queryBus.execute<GetAttendanceReportQuery, IStudentReport[]>(
      new GetAttendanceReportQuery(groupId, period, anchorDate, user.role),
    )
  }

  @Query(() => [StudentHistoryRecordType])
  async studentAttendanceHistory(@CurrentUser() user: IJwtUser): Promise<IStudentHistoryRecord[]> {
    return this.queryBus.execute<GetStudentHistoryQuery, IStudentHistoryRecord[]>(
      new GetStudentHistoryQuery(user.id, user.role),
    )
  }

  @Query(() => StudentSummaryType)
  async studentAttendanceSummary(@CurrentUser() user: IJwtUser): Promise<IStudentSummary> {
    return this.queryBus.execute<GetStudentSummaryQuery, IStudentSummary>(
      new GetStudentSummaryQuery(user.id, user.role),
    )
  }

  @Query(() => ExportStatusType)
  async attendanceExportStatus(
    @Args('jobId', { type: () => String }) jobId: string,
    @CurrentUser() user: IJwtUser,
  ): Promise<IExportStatus> {
    return this.queryBus.execute<GetExportStatusQuery, IExportStatus>(
      new GetExportStatusQuery(jobId, user.role),
    )
  }

  @Query(() => AttendanceReportResultType)
  async attendanceReportByRange(
    @Args('input') input: AttendanceReportByRangeInput,
    @CurrentUser() user: IJwtUser,
  ): Promise<IAttendanceReportResult> {
    return this.queryBus.execute<GetAttendanceReportByRangeQuery, IAttendanceReportResult>(
      new GetAttendanceReportByRangeQuery(
        input.groupId,
        input.dateFrom,
        input.dateTo,
        input.studentIds ?? null,
        user.role,
        user.id,
      ),
    )
  }

  @Mutation(() => Boolean)
  async recordAttendance(
    @Args('input', { type: () => RecordAttendanceInput }) input: RecordAttendanceInput,
    @CurrentUser() user: IJwtUser,
  ): Promise<boolean> {
    await this.commandBus.execute<RecordAttendanceCommand, void>(
      new RecordAttendanceCommand(input.groupId, input.date, input.records, user.id, user.role),
    )
    return true
  }

  @Mutation(() => ExportJobType)
  async exportAttendance(
    @Args('input', { type: () => ExportAttendanceInput }) input: ExportAttendanceInput,
    @CurrentUser() user: IJwtUser,
  ): Promise<IExportJobResult> {
    return this.commandBus.execute<ExportAttendanceCommand, IExportJobResult>(
      new ExportAttendanceCommand(input.groupId, input.period, input.format, user.id, user.role),
    )
  }
}
