import { registerEnumType } from '@nestjs/graphql'

export enum ExportJobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  DONE = 'done',
  FAILED = 'failed',
}

registerEnumType(ExportJobStatus, { name: 'ExportJobStatus' })
