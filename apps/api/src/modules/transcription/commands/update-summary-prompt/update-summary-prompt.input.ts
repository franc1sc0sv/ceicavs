import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString, MaxLength } from 'class-validator'

@InputType()
export class UpdateSummaryPromptInput {
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  @Field({ nullable: true })
  prompt?: string
}
