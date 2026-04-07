import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'
import type { IJwtUser } from '../../../common/types'
import { NoteType } from '../types/note.type'
import { TaskItemType } from '../types/task-item.type'
import { CreateNoteInput } from '../commands/create-note/create-note.input'
import { UpdateNoteInput } from '../commands/update-note/update-note.input'
import { CreateTaskItemInput } from '../commands/create-task-item/create-task-item.input'
import { UpdateTaskItemInput } from '../commands/update-task-item/update-task-item.input'
import { ReorderTaskItemsInput } from '../commands/reorder-task-items/reorder-task-items.input'
import { GetNotesQuery } from '../queries/get-notes/get-notes.query'
import { GetTaskItemsQuery } from '../queries/get-task-items/get-task-items.query'
import { CreateNoteCommand } from '../commands/create-note/create-note.command'
import { UpdateNoteCommand } from '../commands/update-note/update-note.command'
import { DeleteNoteCommand } from '../commands/delete-note/delete-note.command'
import { CreateTaskItemCommand } from '../commands/create-task-item/create-task-item.command'
import { UpdateTaskItemCommand } from '../commands/update-task-item/update-task-item.command'
import { DeleteTaskItemCommand } from '../commands/delete-task-item/delete-task-item.command'
import { ReorderTaskItemsCommand } from '../commands/reorder-task-items/reorder-task-items.command'
import type { INote } from '../interfaces/note.interfaces'
import type { ITaskItem } from '../interfaces/task-item.interfaces'

@Resolver()
@UseGuards(JwtAuthGuard)
export class ToolsResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [NoteType])
  async notes(@CurrentUser() user: IJwtUser): Promise<INote[]> {
    return this.queryBus.execute<GetNotesQuery, INote[]>(new GetNotesQuery(user.id, user.role))
  }

  @Mutation(() => NoteType)
  async createNote(@CurrentUser() user: IJwtUser, @Args('input') input: CreateNoteInput): Promise<INote> {
    return this.commandBus.execute<CreateNoteCommand, INote>(new CreateNoteCommand(user.id, input.content, user.role))
  }

  @Mutation(() => NoteType)
  async updateNote(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateNoteInput,
  ): Promise<INote> {
    return this.commandBus.execute<UpdateNoteCommand, INote>(
      new UpdateNoteCommand(id, input.content, user.id, user.role),
    )
  }

  @Mutation(() => Boolean)
  async deleteNote(@CurrentUser() user: IJwtUser, @Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.commandBus.execute<DeleteNoteCommand, void>(new DeleteNoteCommand(id, user.id, user.role))
    return true
  }

  @Query(() => [TaskItemType])
  async taskItems(@CurrentUser() user: IJwtUser): Promise<ITaskItem[]> {
    return this.queryBus.execute<GetTaskItemsQuery, ITaskItem[]>(new GetTaskItemsQuery(user.id, user.role))
  }

  @Mutation(() => TaskItemType)
  async createTaskItem(@CurrentUser() user: IJwtUser, @Args('input') input: CreateTaskItemInput): Promise<ITaskItem> {
    return this.commandBus.execute<CreateTaskItemCommand, ITaskItem>(
      new CreateTaskItemCommand(user.id, input.text, user.role),
    )
  }

  @Mutation(() => TaskItemType)
  async updateTaskItem(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTaskItemInput,
  ): Promise<ITaskItem> {
    return this.commandBus.execute<UpdateTaskItemCommand, ITaskItem>(
      new UpdateTaskItemCommand(id, { text: input.text, completed: input.completed }, user.id, user.role),
    )
  }

  @Mutation(() => Boolean)
  async deleteTaskItem(@CurrentUser() user: IJwtUser, @Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.commandBus.execute<DeleteTaskItemCommand, void>(new DeleteTaskItemCommand(id, user.id, user.role))
    return true
  }

  @Mutation(() => Boolean)
  async reorderTaskItems(@CurrentUser() user: IJwtUser, @Args('input') input: ReorderTaskItemsInput): Promise<boolean> {
    await this.commandBus.execute<ReorderTaskItemsCommand, void>(
      new ReorderTaskItemsCommand(input.items, user.id, user.role),
    )
    return true
  }
}
