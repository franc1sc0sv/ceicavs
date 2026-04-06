import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StudentReportType {
  @Field(() => ID)
  studentId: string

  @Field(() => String)
  studentName: string

  @Field(() => Float)
  attendanceRate: number

  @Field(() => Int)
  presentCount: number

  @Field(() => Int)
  absentCount: number

  @Field(() => Int)
  lateCount: number

  @Field(() => Int)
  excusedCount: number

  @Field(() => Int)
  totalDays: number
}
