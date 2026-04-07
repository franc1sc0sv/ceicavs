import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DashboardPostsByStatusType {
  @Field(() => Int)
  published: number

  @Field(() => Int)
  draft: number

  @Field(() => Int)
  rejected: number
}
