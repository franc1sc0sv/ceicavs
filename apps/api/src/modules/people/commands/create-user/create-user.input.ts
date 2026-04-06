import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator'
import { UserRole, UserRoleGql } from '../../../../common/types/user-role.enum'

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  name: string

  @Field(() => String)
  @IsEmail()
  email: string

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password: string

  @Field(() => UserRoleGql)
  @IsEnum(UserRole)
  role: UserRole
}
