import { InputType, Field } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

@InputType()
export class UpdateTranscriptionInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  recordingId: string

  @IsString()
  @IsNotEmpty()
  @Field()
  fullTranscript: string

  @IsString()
  @IsNotEmpty()
  @Field()
  segments: string

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  summary?: string
}
