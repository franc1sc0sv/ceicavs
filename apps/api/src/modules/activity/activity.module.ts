import { Module } from '@nestjs/common'
import { IActivityRepository } from './repositories/activity.repository.abstract'
import { ActivityRepository } from './repositories/activity.repository'
import { ActivityListener } from './listeners/activity.listener'

@Module({
  providers: [
    { provide: IActivityRepository, useClass: ActivityRepository },
    ActivityListener,
  ],
})
export class ActivityModule {}
