import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { UserRole, UserRoleGql } from '../../../../common/types/user-role.enum'

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string

  @Field(() => UserRoleGql, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}
