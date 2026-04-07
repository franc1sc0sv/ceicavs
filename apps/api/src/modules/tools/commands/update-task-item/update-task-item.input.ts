import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString, IsBoolean } from 'class-validator'

@InputType()
export class UpdateTaskItemInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  text?: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean
}
