import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { IDatabaseService } from '../../../common/database/database.abstract'
import { IActivityRepository } from '../repositories/activity.repository.abstract'
import { ActivityType, ActivityEntityType } from '../interfaces/activity.interfaces'
import { AttendanceSubmittedEvent } from '../../attendance/events/attendance-submitted.event'
import { PostCreatedEvent } from '../../blog/events/post-created.event'
import { DraftReviewedEvent } from '../../blog/events/draft-reviewed.event'
import { PostPublishedEvent } from '../../blog/events/post-published.event'
import { UserCreatedEvent } from '../../people/events/user-created.event'
import { UserDeletedEvent } from '../../people/events/user-deleted.event'

@Injectable()
export class ActivityListener {
  constructor(
    private readonly db: IDatabaseService,
    private readonly activityRepository: IActivityRepository,
  ) {}

  @OnEvent('attendance.submitted')
  async onAttendanceSubmitted(event: AttendanceSubmittedEvent): Promise<void> {
    await this.db.$transaction((tx) =>
      this.activityRepository.create(
        {
          type: ActivityType.ATTENDANCE_SUBMITTED,
          description: JSON.stringify({}),
          actorId: event.submittedBy,
          actorRole: event.actorRole,
          entityId: event.groupId,
          entityType: ActivityEntityType.GROUP,
        },
        tx,
      ),
    )
  }

  @OnEvent('post.created')
  async onPostCreated(event: PostCreatedEvent): Promise<void> {
    await this.db.$transaction((tx) =>
      this.activityRepository.create(
        {
          type: ActivityType.POST_CREATED,
          description: JSON.stringify({}),
          actorId: event.authorId,
          actorRole: event.actorRole,
          entityId: event.postId,
          entityType: ActivityEntityType.POST,
        },
        tx,
      ),
    )
  }

  @OnEvent('draft.reviewed')
  async onDraftReviewed(event: DraftReviewedEvent): Promise<void> {
    await this.db.$transaction((tx) =>
      this.activityRepository.create(
        {
          type: ActivityType.DRAFT_REVIEWED,
          description: JSON.stringify({ action: event.action }),
          actorId: event.reviewerId,
          actorRole: event.actorRole,
          entityId: event.postId,
          entityType: ActivityEntityType.POST,
        },
        tx,
      ),
    )
  }

  @OnEvent('post.published')
  async onPostPublished(event: PostPublishedEvent): Promise<void> {
    await this.db.$transaction((tx) =>
      this.activityRepository.create(
        {
          type: ActivityType.POST_PUBLISHED,
          description: JSON.stringify({}),
          actorId: event.reviewerId,
          actorRole: event.reviewerRole,
          entityId: event.postId,
          entityType: ActivityEntityType.POST,
        },
        tx,
      ),
    )
  }

  @OnEvent('user.created')
  async onUserCreated(event: UserCreatedEvent): Promise<void> {
    await this.db.$transaction((tx) =>
      this.activityRepository.create(
        {
          type: ActivityType.USER_CREATED,
          description: JSON.stringify({ role: event.role }),
          actorId: event.creatorId,
          actorRole: event.creatorRole,
          entityId: event.userId,
          entityType: ActivityEntityType.USER,
        },
        tx,
      ),
    )
  }

  @OnEvent('user.deleted')
  async onUserDeleted(event: UserDeletedEvent): Promise<void> {
    await this.db.$transaction((tx) =>
      this.activityRepository.create(
        {
          type: ActivityType.USER_DELETED,
          description: JSON.stringify({}),
          actorId: event.deleterId,
          actorRole: event.deleterRole,
          entityId: event.userId,
          entityType: ActivityEntityType.USER,
        },
        tx,
      ),
    )
  }
}
