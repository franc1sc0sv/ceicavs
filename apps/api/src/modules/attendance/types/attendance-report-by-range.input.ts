import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

@InputType()
export class AttendanceReportByRangeInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  groupId: string

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  dateFrom: string

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  dateTo: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  studentIds?: string[]
}
