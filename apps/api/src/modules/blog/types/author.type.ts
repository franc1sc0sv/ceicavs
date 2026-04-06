import { Field, ID, ObjectType } from '@nestjs/graphql'
import { UserRole, UserRoleGql } from '../../../common/types/user-role.enum'

@ObjectType()
export class AuthorType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  avatarUrl: string | null

  @Field(() => UserRoleGql)
  role: UserRole
}
