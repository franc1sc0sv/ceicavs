import { Field, InputType } from '@nestjs/graphql'
import { ArrayMinSize, IsArray, IsString } from 'class-validator'

@InputType()
export class BulkDeleteUsersInput {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  ids: string[]
}
