import type { UserRole } from '@ceicavs/shared'
import type { IReorderItem } from '../../interfaces/task-item.interfaces'

export class ReorderTaskItemsCommand {
  constructor(
    public readonly items: IReorderItem[],
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
