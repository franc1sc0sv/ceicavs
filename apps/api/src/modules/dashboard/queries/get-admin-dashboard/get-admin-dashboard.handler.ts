import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IDashboardRepository } from '../../repositories/dashboard.repository.abstract'
import type { IAdminDashboardStats } from '../../interfaces/dashboard.interfaces'
import { GetAdminDashboardQuery } from './get-admin-dashboard.query'

@QueryHandler(GetAdminDashboardQuery)
export class GetAdminDashboardHandler extends BaseQueryHandler<
  GetAdminDashboardQuery,
  IAdminDashboardStats
> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly dashboardRepository: IDashboardRepository,
  ) {
    super(db)
  }

  protected async handle(
    query: GetAdminDashboardQuery,
    tx: TxClient,
  ): Promise<IAdminDashboardStats> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.MANAGE, Subject.ALL)) {
      throw new ForbiddenException()
    }

    const now = new Date()

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    const dayOfWeek = now.getDay()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - dayOfWeek)
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const startOfLastWeek = new Date(startOfWeek)
    startOfLastWeek.setDate(startOfWeek.getDate() - 7)
    const endOfLastWeek = new Date(endOfWeek)
    endOfLastWeek.setDate(endOfWeek.getDate() - 7)

    const [
      totalUsers,
      totalGroups,
      postsThisMonth,
      postsLastMonth,
      rateThisWeek,
      rateLastWeek,
      usersByRole,
      postsByStatus,
      attendanceTrend,
    ] = await Promise.all([
      this.dashboardRepository.countActiveUsers(tx),
      this.dashboardRepository.countActiveGroups(tx),
      this.dashboardRepository.countPostsByStatusInRange(startOfMonth, endOfMonth, tx),
      this.dashboardRepository.countPostsByStatusInRange(startOfLastMonth, endOfLastMonth, tx),
      this.dashboardRepository.computeGlobalAttendanceRateInRange(startOfWeek, endOfWeek, tx),
      this.dashboardRepository.computeGlobalAttendanceRateInRange(startOfLastWeek, endOfLastWeek, tx),
      this.dashboardRepository.countUsersByRole(tx),
      this.dashboardRepository.countAllPostsByStatus(tx),
      this.dashboardRepository.computeGlobalAttendanceTrend(7, tx),
    ])

    return {
      totalUsers,
      totalGroups,
      publishedPostsThisMonth: postsThisMonth.published,
      publishedPostsLastMonth: postsLastMonth.published,
      globalAttendanceRateThisWeek: rateThisWeek,
      globalAttendanceRateLastWeek: rateLastWeek,
      usersByRole,
      postsByStatus,
      attendanceTrend,
    }
  }
}
