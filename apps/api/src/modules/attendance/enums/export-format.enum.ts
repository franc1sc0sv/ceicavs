import { registerEnumType } from '@nestjs/graphql'

export enum ExportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
}

registerEnumType(ExportFormat, { name: 'ExportFormat' })
