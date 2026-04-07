import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DashboardUsersByRoleType {
  @Field(() => Int)
  admin: number

  @Field(() => Int)
  teacher: number

  @Field(() => Int)
  student: number
}
