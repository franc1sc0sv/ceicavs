import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ImportUsersResultType {
  @Field(() => Int)
  created: number

  @Field(() => Int)
  skipped: number

  @Field(() => [String])
  errors: string[]
}
