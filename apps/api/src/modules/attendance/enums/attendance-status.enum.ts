import { registerEnumType } from '@nestjs/graphql'
import { AttendanceStatus } from '@ceicavs/db/enums'

registerEnumType(AttendanceStatus, { name: 'AttendanceStatus' })

export { AttendanceStatus }
