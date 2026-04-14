import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsBoolean, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { PostImageInput } from '../create-post/create-post.input'

@InputType()
export class UpdatePostInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  excerpt?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[]

  @Field(() => [PostImageInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostImageInput)
  images?: PostImageInput[]

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  publish?: boolean
}
