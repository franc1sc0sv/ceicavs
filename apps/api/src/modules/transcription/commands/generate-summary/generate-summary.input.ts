import { InputType, Field, ID } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

@InputType()
export class GenerateSummaryInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => ID)
  recordingId: string

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  @Field({ nullable: true })
  prompt?: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Field({ nullable: true })
  language?: string
}
