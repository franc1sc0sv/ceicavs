import { registerEnumType } from '@nestjs/graphql'
import { AttendanceStatus } from '@ceicavs/db'

registerEnumType(AttendanceStatus, { name: 'AttendanceStatus' })

export { AttendanceStatus }
