import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { StudentReportType } from './student-report.type'

@ObjectType()
export class AttendanceReportSummaryType {
  @Field(() => Int)
  totalStudents: number

  @Field(() => Float)
  averageRate: number

  @Field(() => Int)
  totalPresent: number

  @Field(() => Int)
  totalAbsent: number

  @Field(() => Int)
  totalLate: number

  @Field(() => Int)
  totalExcused: number

  @Field(() => Int)
  totalSessions: number
}

@ObjectType()
export class AttendanceReportResultType {
  @Field(() => String)
  groupId: string

  @Field(() => String)
  groupName: string

  @Field(() => String)
  dateFrom: string

  @Field(() => String)
  dateTo: string

  @Field(() => AttendanceReportSummaryType)
  summary: AttendanceReportSummaryType

  @Field(() => [StudentReportType])
  students: StudentReportType[]
}
