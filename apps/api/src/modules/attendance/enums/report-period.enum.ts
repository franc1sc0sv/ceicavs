import { registerEnumType } from '@nestjs/graphql'

export enum ReportPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

registerEnumType(ReportPeriod, { name: 'ReportPeriod' })
