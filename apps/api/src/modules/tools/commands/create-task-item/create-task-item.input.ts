import { InputType, Field } from '@nestjs/graphql'
import { IsString, IsNotEmpty } from 'class-validator'

@InputType()
export class CreateTaskItemInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  text: string
}
