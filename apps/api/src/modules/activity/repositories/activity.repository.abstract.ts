import type { RepositoryMethod } from '../../../common/cqrs'
import type { ICreateActivityData } from '../interfaces/activity.interfaces'

export abstract class IActivityRepository {
  abstract create: RepositoryMethod<[data: ICreateActivityData], void>
}
