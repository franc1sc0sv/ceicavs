import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateGroupInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string
}
