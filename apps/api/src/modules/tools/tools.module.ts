import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ToolsResolver } from './resolvers/tools.resolver'
import { FileConvertController } from './controllers/file-convert.controller'
import { INoteRepository } from './interfaces/note.repository'
import { ITaskItemRepository } from './interfaces/task-item.repository'
import { IToolRepository } from './interfaces/tool.interfaces'
import { NoteRepository } from './repositories/note.repository'
import { TaskItemRepository } from './repositories/task-item.repository'
import { ToolRepository } from './repositories/tool.repository'
import { GetNotesHandler } from './queries/get-notes/get-notes.handler'
import { GetTaskItemsHandler } from './queries/get-task-items/get-task-items.handler'
import { GetToolsHandler } from './queries/get-tools/get-tools.handler'
import { CreateNoteHandler } from './commands/create-note/create-note.handler'
import { UpdateNoteHandler } from './commands/update-note/update-note.handler'
import { DeleteNoteHandler } from './commands/delete-note/delete-note.handler'
import { CreateTaskItemHandler } from './commands/create-task-item/create-task-item.handler'
import { UpdateTaskItemHandler } from './commands/update-task-item/update-task-item.handler'
import { DeleteTaskItemHandler } from './commands/delete-task-item/delete-task-item.handler'
import { ReorderTaskItemsHandler } from './commands/reorder-task-items/reorder-task-items.handler'

@Module({
  imports: [CqrsModule],
  controllers: [FileConvertController],
  providers: [
    ToolsResolver,
    { provide: INoteRepository, useClass: NoteRepository },
    { provide: ITaskItemRepository, useClass: TaskItemRepository },
    { provide: IToolRepository, useClass: ToolRepository },
    GetNotesHandler,
    GetTaskItemsHandler,
    GetToolsHandler,
    CreateNoteHandler,
    UpdateNoteHandler,
    DeleteNoteHandler,
    CreateTaskItemHandler,
    UpdateTaskItemHandler,
    DeleteTaskItemHandler,
    ReorderTaskItemsHandler,
  ],
})
export class ToolsModule {}
