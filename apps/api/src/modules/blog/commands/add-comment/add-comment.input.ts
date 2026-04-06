import { Field, ID, InputType } from '@nestjs/graphql'
import { IsString, IsUrl, MinLength, ValidateIf } from 'class-validator'

@InputType()
export class AddCommentInput {
  @Field(() => ID)
  @IsString()
  postId: string

  @Field(() => String)
  @IsString()
  @MinLength(1)
  text: string

  @Field(() => ID, { nullable: true })
  @ValidateIf((o: AddCommentInput) => o.parentId != null)
  @IsString()
  parentId?: string | null

  @Field(() => String, { nullable: true })
  @ValidateIf((o: AddCommentInput) => o.gifUrl != null)
  @IsUrl()
  gifUrl?: string | null

  @Field(() => String, { nullable: true })
  @ValidateIf((o: AddCommentInput) => o.gifAlt != null)
  @IsString()
  gifAlt?: string | null
}
