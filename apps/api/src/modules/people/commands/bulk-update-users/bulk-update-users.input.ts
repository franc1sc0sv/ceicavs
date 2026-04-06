import { Field, InputType } from '@nestjs/graphql'
import { ArrayMinSize, IsArray, IsEnum, IsString } from 'class-validator'
import { UserRole, UserRoleGql } from '../../../../common/types/user-role.enum'

@InputType()
export class BulkUpdateUsersInput {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  ids: string[]

  @Field(() => UserRoleGql)
  @IsEnum(UserRole)
  role: UserRole
}
