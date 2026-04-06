import { Field, ID, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PostStatus } from './post-status.enum'

@InputType()
export class PostFiltersInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string

  @Field(() => PostStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  authorId?: string
}
