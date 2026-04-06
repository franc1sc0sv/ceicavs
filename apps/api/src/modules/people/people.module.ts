import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { IUserRepository } from './interfaces/user.repository'
import { IGroupRepository } from './interfaces/group.repository'
import { UserRepository } from './repositories/user.repository'
import { GroupRepository } from './repositories/group.repository'
import { UserResolver } from './resolvers/user.resolver'
import { GroupResolver } from './resolvers/group.resolver'
import { CreateUserHandler } from './commands/create-user/create-user.handler'
import { UpdateUserHandler } from './commands/update-user/update-user.handler'
import { DeleteUserHandler } from './commands/delete-user/delete-user.handler'
import { BulkDeleteUsersHandler } from './commands/bulk-delete-users/bulk-delete-users.handler'
import { BulkUpdateUsersHandler } from './commands/bulk-update-users/bulk-update-users.handler'
import { ImportUsersHandler } from './commands/import-users/import-users.handler'
import { CreateGroupHandler } from './commands/create-group/create-group.handler'
import { UpdateGroupHandler } from './commands/update-group/update-group.handler'
import { DeleteGroupHandler } from './commands/delete-group/delete-group.handler'
import { AddMemberToGroupHandler } from './commands/add-member-to-group/add-member-to-group.handler'
import { RemoveMemberFromGroupHandler } from './commands/remove-member-from-group/remove-member-from-group.handler'
import { GetUsersHandler } from './queries/get-users/get-users.handler'
import { GetUserHandler } from './queries/get-user/get-user.handler'
import { GetGroupsHandler } from './queries/get-groups/get-groups.handler'
import { GetGroupHandler } from './queries/get-group/get-group.handler'

@Module({
  imports: [CqrsModule],
  providers: [
    UserResolver,
    GroupResolver,
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IGroupRepository, useClass: GroupRepository },
    CreateUserHandler,
    UpdateUserHandler,
    DeleteUserHandler,
    BulkDeleteUsersHandler,
    BulkUpdateUsersHandler,
    ImportUsersHandler,
    CreateGroupHandler,
    UpdateGroupHandler,
    DeleteGroupHandler,
    AddMemberToGroupHandler,
    RemoveMemberFromGroupHandler,
    GetUsersHandler,
    GetUserHandler,
    GetGroupsHandler,
    GetGroupHandler,
  ],
})
export class PeopleModule {}
