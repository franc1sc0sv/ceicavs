import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { IDashboardRepository } from '../../repositories/dashboard.repository.abstract'
import type { IStudentDashboardStats } from '../../interfaces/dashboard.interfaces'
import { GetStudentDashboardQuery } from './get-student-dashboard.query'

@QueryHandler(GetStudentDashboardQuery)
export class GetStudentDashboardHandler extends BaseQueryHandler<
  GetStudentDashboardQuery,
  IStudentDashboardStats
> {
  constructor(
    protected readonly db: IDatabaseService,
    private readonly dashboardRepository: IDashboardRepository,
  ) {
    super(db)
  }

  protected async handle(
    query: GetStudentDashboardQuery,
    tx: TxClient,
  ): Promise<IStudentDashboardStats> {
    const ability = defineAbilityFor(query.role)

    if (
      !ability.can(Action.READ, Subject.ATTENDANCE_RECORD) ||
      !ability.can(Action.READ, Subject.POST)
    ) {
      throw new ForbiddenException()
    }

    const [
      myAttendanceRate,
      myCurrentStreak,
      myDraftCount,
      myGroupMembershipCount,
      myAttendanceTrend,
    ] = await Promise.all([
      this.dashboardRepository.computeStudentAttendanceRate(query.userId, tx),
      this.dashboardRepository.computeStudentStreak(query.userId, tx),
      this.dashboardRepository.countDraftsForUser(query.userId, tx),
      this.dashboardRepository.countGroupMemberships(query.userId, tx),
      this.dashboardRepository.computeStudentAttendanceTrend(query.userId, 7, tx),
    ])

    return {
      myAttendanceRate,
      myCurrentStreak,
      myDraftCount,
      myGroupMembershipCount,
      myAttendanceTrend,
    }
  }
}
