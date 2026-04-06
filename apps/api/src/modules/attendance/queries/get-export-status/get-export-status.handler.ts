import { QueryHandler } from '@nestjs/cqrs'
import type { TxClient } from '@ceicavs/db'
import { defineAbilityFor, Action, Subject } from '@ceicavs/shared'
import { BaseQueryHandler } from '../../../../common/cqrs'
import { IDatabaseService } from '../../../../common/database/database.abstract'
import { ForbiddenException } from '../../../../common/errors'
import { ExportJobStatus } from '../../enums/export-job-status.enum'
import type { IExportStatus } from '../../interfaces/attendance.interfaces'
import { GetExportStatusQuery } from './get-export-status.query'

@QueryHandler(GetExportStatusQuery)
export class GetExportStatusHandler extends BaseQueryHandler<GetExportStatusQuery, IExportStatus> {
  constructor(protected readonly db: IDatabaseService) {
    super(db)
  }

  protected async handle(
    query: GetExportStatusQuery,
    _tx: TxClient,
  ): Promise<IExportStatus> {
    const ability = defineAbilityFor(query.role)

    if (!ability.can(Action.EXPORT, Subject.ATTENDANCE_RECORD)) {
      throw new ForbiddenException()
    }

    return {
      jobId: query.jobId,
      status: ExportJobStatus.PENDING,
      downloadUrl: null,
    }
  }
}
