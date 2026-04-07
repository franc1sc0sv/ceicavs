import type { UserRole } from '@ceicavs/shared'
import type { IUpdateTaskItemData } from '../../interfaces/task-item.interfaces'

export class UpdateTaskItemCommand {
  constructor(
    public readonly id: string,
    public readonly data: IUpdateTaskItemData,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
