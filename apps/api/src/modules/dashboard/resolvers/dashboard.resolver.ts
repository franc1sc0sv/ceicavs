import { Args, Int, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'
import type { IJwtUser } from '../../../common/types'
import { AdminDashboardStatsType } from '../types/admin-dashboard-stats.type'
import { TeacherDashboardStatsType } from '../types/teacher-dashboard-stats.type'
import { StudentDashboardStatsType } from '../types/student-dashboard-stats.type'
import { ActivityItemType } from '../types/activity-item.type'
import { GetAdminDashboardQuery } from '../queries/get-admin-dashboard/get-admin-dashboard.query'
import { GetTeacherDashboardQuery } from '../queries/get-teacher-dashboard/get-teacher-dashboard.query'
import { GetStudentDashboardQuery } from '../queries/get-student-dashboard/get-student-dashboard.query'
import { GetRecentActivityQuery } from '../queries/get-recent-activity/get-recent-activity.query'
import type {
  IAdminDashboardStats,
  IActivityItem,
  IStudentDashboardStats,
  ITeacherDashboardStats,
} from '../interfaces/dashboard.interfaces'

@Resolver()
export class DashboardResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => AdminDashboardStatsType)
  @UseGuards(JwtAuthGuard)
  async adminDashboard(@CurrentUser() user: IJwtUser): Promise<IAdminDashboardStats> {
    return this.queryBus.execute<GetAdminDashboardQuery, IAdminDashboardStats>(
      new GetAdminDashboardQuery(user.id, user.role),
    )
  }

  @Query(() => TeacherDashboardStatsType)
  @UseGuards(JwtAuthGuard)
  async teacherDashboard(@CurrentUser() user: IJwtUser): Promise<ITeacherDashboardStats> {
    return this.queryBus.execute<GetTeacherDashboardQuery, ITeacherDashboardStats>(
      new GetTeacherDashboardQuery(user.id, user.role),
    )
  }

  @Query(() => StudentDashboardStatsType)
  @UseGuards(JwtAuthGuard)
  async studentDashboard(@CurrentUser() user: IJwtUser): Promise<IStudentDashboardStats> {
    return this.queryBus.execute<GetStudentDashboardQuery, IStudentDashboardStats>(
      new GetStudentDashboardQuery(user.id, user.role),
    )
  }

  @Query(() => [ActivityItemType])
  @UseGuards(JwtAuthGuard)
  async recentActivity(
    @CurrentUser() user: IJwtUser,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number,
  ): Promise<IActivityItem[]> {
    return this.queryBus.execute<GetRecentActivityQuery, IActivityItem[]>(
      new GetRecentActivityQuery(user.id, user.role, limit),
    )
  }
}
