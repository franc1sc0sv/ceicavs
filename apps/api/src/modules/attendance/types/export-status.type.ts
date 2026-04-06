import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ExportJobStatus } from '../enums/export-job-status.enum'

@ObjectType()
export class ExportStatusType {
  @Field(() => ID)
  jobId: string

  @Field(() => ExportJobStatus)
  status: ExportJobStatus

  @Field(() => String, { nullable: true })
  downloadUrl: string | null
}
