import { registerEnumType } from '@nestjs/graphql'
import { PostStatus } from '@ceicavs/db'

registerEnumType(PostStatus, { name: 'PostStatus' })

export { PostStatus }
