import { Field, InputType } from '@nestjs/graphql'
import { IsIn, IsOptional, IsString } from 'class-validator'
import type { DraftAction } from '../../interfaces/blog.interfaces'

@InputType()
export class ReviewDraftInput {
  @Field(() => String)
  @IsIn(['approve', 'reject'])
  action: DraftAction

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  rejectionNote?: string
}
