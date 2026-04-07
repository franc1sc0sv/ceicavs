import { Field, ID, ObjectType } from '@nestjs/graphql'
import { UserRoleGql, UserRole } from '../../../common/types/user-role.enum'

@ObjectType()
export class ActivityItemType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  type: string

  @Field(() => String)
  description: string

  @Field(() => String)
  actorName: string

  @Field(() => String, { nullable: true })
  actorAvatarUrl: string | null

  @Field(() => UserRoleGql)
  actorRole: UserRole

  @Field(() => String, { nullable: true })
  entityId: string | null

  @Field(() => String, { nullable: true })
  entityType: string | null

  @Field(() => Date)
  createdAt: Date
}
