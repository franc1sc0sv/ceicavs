import { Field, ID, ObjectType } from '@nestjs/graphql'
import { UserRole, UserRoleGql } from '../../../common/types/user-role.enum'
import { UserGroupType } from './user-group.type'

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  email: string

  @Field(() => UserRoleGql)
  role: UserRole

  @Field(() => String, { nullable: true })
  avatarUrl: string | null

  @Field(() => Date)
  createdAt: Date

  @Field(() => [UserGroupType], { nullable: true })
  groups?: UserGroupType[]
}
