import { InputType, Field, ID } from '@nestjs/graphql'
import { IsString, IsNotEmpty } from 'class-validator'

@InputType()
export class DeleteRecordingInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => ID)
  id: string
}
