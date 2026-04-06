import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserGroupType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string
}
