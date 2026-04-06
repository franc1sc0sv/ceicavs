import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsString } from 'class-validator'
import { ExportFormat } from '../enums/export-format.enum'
import { ReportPeriod } from '../enums/report-period.enum'

@InputType()
export class ExportAttendanceInput {
  @Field(() => String)
  @IsString()
  groupId: string

  @Field(() => ReportPeriod)
  @IsEnum(ReportPeriod)
  period: ReportPeriod

  @Field(() => ExportFormat)
  @IsEnum(ExportFormat)
  format: ExportFormat
}
