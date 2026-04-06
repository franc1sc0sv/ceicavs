import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ExportJobType {
  @Field(() => ID)
  jobId: string
}
