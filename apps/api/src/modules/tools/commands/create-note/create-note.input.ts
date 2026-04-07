import { InputType, Field } from '@nestjs/graphql'
import { IsString, IsNotEmpty } from 'class-validator'

@InputType()
export class CreateNoteInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  content: string
}
