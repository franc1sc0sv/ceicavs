import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class NoteType {
  @Field(() => ID)
  id: string

  @Field(() => String)
  content: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
