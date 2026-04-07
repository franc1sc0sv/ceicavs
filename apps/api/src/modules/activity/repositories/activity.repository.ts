import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { IActivityRepository } from './activity.repository.abstract'
import type { ICreateActivityData } from '../interfaces/activity.interfaces'

@Injectable()
export class ActivityRepository extends IActivityRepository {
  create = async (data: ICreateActivityData, tx: TxClient): Promise<void> => {
    await tx.activity.create({
      data: {
        type: data.type,
        description: data.description,
        actorId: data.actorId,
        actorRole: data.actorRole,
        entityId: data.entityId,
        entityType: data.entityType,
      },
    })
  }
}
