import { registerEnumType } from '@nestjs/graphql'
import { UserRole } from '@ceicavs/shared'

const UserRoleGql = {
  [UserRole.ADMIN]: UserRole.ADMIN,
  [UserRole.TEACHER]: UserRole.TEACHER,
  [UserRole.STUDENT]: UserRole.STUDENT,
} as const

registerEnumType(UserRoleGql, { name: 'UserRole' })

export { UserRole, UserRoleGql }
