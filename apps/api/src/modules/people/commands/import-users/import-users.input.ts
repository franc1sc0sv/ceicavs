import { Field, InputType } from '@nestjs/graphql'
import { ArrayMinSize, IsArray, IsEmail, IsEnum, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { UserRole, UserRoleGql } from '../../../../common/types/user-role.enum'

@InputType()
export class ImportUserRowInput {
  @Field(() => String)
  @IsString()
  name: string

  @Field(() => String)
  @IsEmail()
  email: string

  @Field(() => UserRoleGql)
  @IsEnum(UserRole)
  role: UserRole
}

@InputType()
export class ImportUsersInput {
  @Field(() => [ImportUserRowInput])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ImportUserRowInput)
  rows: ImportUserRowInput[]
}
