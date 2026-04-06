import { Field, InputType, Int } from '@nestjs/graphql'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, IsUrl, MinLength, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

@InputType()
export class PostImageInput {
  @Field(() => String)
  @IsUrl()
  url: string

  @Field(() => String)
  @IsString()
  publicId: string

  @Field(() => Int)
  @IsInt()
  order: number
}

@InputType()
export class CreatePostInput {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  title: string

  @Field(() => String)
  @IsString()
  @MinLength(1)
  excerpt: string

  @Field(() => String)
  @IsString()
  @MinLength(1)
  content: string

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  categoryIds: string[]

  @Field(() => Boolean)
  @IsBoolean()
  publish: boolean

  @Field(() => [PostImageInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostImageInput)
  images?: PostImageInput[]
}
