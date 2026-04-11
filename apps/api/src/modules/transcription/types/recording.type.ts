import { ObjectType, Field, ID, Int } from '@nestjs/graphql'
import { TranscriptionType } from './transcription.type'

@ObjectType()
export class RecordingType {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field(() => Int)
  duration: number

  @Field({ nullable: true })
  audioUrl?: string

  @Field({ nullable: true })
  cloudinaryPublicId?: string

  @Field()
  transcriptionStatus: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => TranscriptionType, { nullable: true })
  transcription?: TranscriptionType
}
