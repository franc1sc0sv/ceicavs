import { InputType, Field, ID } from '@nestjs/graphql'
import { IsOptional, IsString, IsBoolean, IsNotEmpty } from 'class-validator'

@InputType()
export class UpdateTaskItemInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  text?: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean
}
