import { InputType, Field, ID, Int } from '@nestjs/graphql'
import { IsString, IsInt, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

@InputType()
export class ReorderItemInput {
  @Field(() => ID)
  @IsString()
  id: string

  @Field(() => Int)
  @IsInt()
  order: number
}

@InputType()
export class ReorderTaskItemsInput {
  @Field(() => [ReorderItemInput])
  @ValidateNested({ each: true })
  @Type(() => ReorderItemInput)
  items: ReorderItemInput[]
}
