import type { UserRole } from '@ceicavs/shared'
import type { IUpdatePostData } from '../../interfaces/blog.interfaces'

export class UpdatePostCommand {
  constructor(
    public readonly postId: string,
    public readonly data: IUpdatePostData,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
