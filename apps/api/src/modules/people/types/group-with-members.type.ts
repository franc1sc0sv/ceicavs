import { Field, ObjectType } from '@nestjs/graphql'
import { GroupType } from './group.type'
import { GroupMemberType } from './group-member.type'

@ObjectType()
export class GroupWithMembersType extends GroupType {
  @Field(() => [GroupMemberType])
  members: GroupMemberType[]
}
