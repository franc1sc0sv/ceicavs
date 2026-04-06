import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { UserRole, UserRoleGql } from '../../../../common/types/user-role.enum'

@InputType()
export class UserFiltersInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string

  @Field(() => UserRoleGql, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  groupId?: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isDeactivated?: boolean
}
