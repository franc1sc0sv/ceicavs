import { registerEnumType } from '@nestjs/graphql'
import { UserRole } from '@ceicavs/db/enums'

registerEnumType(UserRole, { name: 'UserRole' })

export { UserRole }
