import { InputType, Field, Int } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator'

@InputType()
export class CreateRecordingInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string

  @IsInt()
  @Min(0)
  @Field(() => Int)
  duration: number

  @IsString()
  @IsNotEmpty()
  @Field()
  audioUrl: string

  @IsString()
  @IsNotEmpty()
  @Field()
  cloudinaryPublicId: string
}
