import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class TranscriptionType {
  @Field(() => ID)
  id: string

  @Field()
  status: string

  @Field()
  summaryStatus: string

  @Field({ nullable: true })
  fullTranscript?: string

  @Field({ nullable: true })
  segments?: string

  @Field({ nullable: true })
  summary?: string

  @Field({ nullable: true })
  summaryError?: string

  @Field(() => [String])
  keyTakeaways: string[]

  @Field(() => [String])
  actionItems: string[]

  @Field({ nullable: true })
  completedAt?: Date
}
