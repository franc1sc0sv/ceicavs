import { registerEnumType } from '@nestjs/graphql'
import { PostStatus } from '@ceicavs/db/enums'

registerEnumType(PostStatus, { name: 'PostStatus' })

export { PostStatus }
