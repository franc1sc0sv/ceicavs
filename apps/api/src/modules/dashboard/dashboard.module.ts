import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { IDashboardRepository } from './repositories/dashboard.repository.abstract'
import { DashboardRepository } from './repositories/dashboard.repository'
import { DashboardResolver } from './resolvers/dashboard.resolver'
import { GetAdminDashboardHandler } from './queries/get-admin-dashboard/get-admin-dashboard.handler'
import { GetTeacherDashboardHandler } from './queries/get-teacher-dashboard/get-teacher-dashboard.handler'
import { GetStudentDashboardHandler } from './queries/get-student-dashboard/get-student-dashboard.handler'
import { GetRecentActivityHandler } from './queries/get-recent-activity/get-recent-activity.handler'

@Module({
  imports: [CqrsModule],
  providers: [
    DashboardResolver,
    { provide: IDashboardRepository, useClass: DashboardRepository },
    GetAdminDashboardHandler,
    GetTeacherDashboardHandler,
    GetStudentDashboardHandler,
    GetRecentActivityHandler,
  ],
})
export class DashboardModule {}
