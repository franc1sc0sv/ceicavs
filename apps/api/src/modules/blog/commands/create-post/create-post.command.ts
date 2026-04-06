import type { UserRole } from '@ceicavs/shared'
import type { ICreatePostData } from '../../interfaces/blog.interfaces'

export class CreatePostCommand {
  constructor(
    public readonly data: ICreatePostData,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
