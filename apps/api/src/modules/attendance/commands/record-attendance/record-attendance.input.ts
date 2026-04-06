import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsDateString, IsEnum, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { AttendanceStatus } from '../../enums/attendance-status.enum'

@InputType()
export class AttendanceRecordItemInput {
  @Field(() => String)
  @IsString()
  studentId: string

  @Field(() => AttendanceStatus)
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus
}

@InputType()
export class RecordAttendanceInput {
  @Field(() => String)
  @IsString()
  groupId: string

  @Field(() => String)
  @IsDateString()
  date: string

  @Field(() => [AttendanceRecordItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordItemInput)
  records: AttendanceRecordItemInput[]
}
