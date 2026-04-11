import { InputType, Field, ID } from '@nestjs/graphql'
import { IsString, IsNotEmpty } from 'class-validator'

@InputType()
export class UpdateNoteInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  content: string
}
