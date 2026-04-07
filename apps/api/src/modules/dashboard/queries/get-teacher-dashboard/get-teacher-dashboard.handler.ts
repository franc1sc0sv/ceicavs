import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IDashboardRepository } from '../../repositories/dashboard.repository.abstract'
import type { ITeacherDashboardStats } from '../../interfaces/dashboard.interfaces'
import { GetTeacherDashboardQuery } from './get-teacher-dashboard.query'

@QueryHandler(GetTeacherDashboardQuery)
export class GetTeacherDashboardHandler extends BaseQueryHandler<
  GetTeacherDashboardQuery,
  ITeacherDashboardStats
> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly dashboardRepository: IDashboardRepository,
  ) {
    super(db)
  }

  protected async handle(
    query: GetTeacherDashboardQuery,
    tx: TxClient,
  ): Promise<ITeacherDashboardStats> {
    const ability = defineAbilityFor(query.role)

    if (
      !ability.can(Action.READ, Subject.GROUP) ||
      !ability.can(Action.READ, Subject.ATTENDANCE_RECORD) ||
      !ability.can(Action.READ, Subject.POST)
    ) {
      throw new ForbiddenException()
    }

    const [
      myGroupCount,
      myGroupsTodayRate,
      myPostCount,
      pendingAttendanceCount,
      myGroupAttendanceTrend,
      myPostsByStatus,
    ] = await Promise.all([
      this.dashboardRepository.countGroupsForTeacher(query.userId, tx),
      this.dashboardRepository.computeTeacherGroupsTodayRate(query.userId, tx),
      this.dashboardRepository.countPostsForUser(query.userId, tx),
      this.dashboardRepository.countPendingAttendanceForTeacher(query.userId, tx),
      this.dashboardRepository.computeTeacherGroupAttendanceTrend(query.userId, 7, tx),
      this.dashboardRepository.countPostsByStatusForUser(query.userId, tx),
    ])

    return {
      myGroupCount,
      myGroupsTodayRate,
      myPostCount,
      pendingAttendanceCount,
      myGroupAttendanceTrend,
      myPostsByStatus,
    }
  }
}
