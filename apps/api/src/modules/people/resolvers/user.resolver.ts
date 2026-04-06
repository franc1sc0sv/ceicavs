import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'
import type { IJwtUser } from '../../../common/types'
import { UserType } from '../types/user.type'
import { ImportUsersResultType } from '../types/import-users-result.type'
import { CreateUserInput } from '../commands/create-user/create-user.input'
import { UpdateUserInput } from '../commands/update-user/update-user.input'
import { BulkDeleteUsersInput } from '../commands/bulk-delete-users/bulk-delete-users.input'
import { BulkUpdateUsersInput } from '../commands/bulk-update-users/bulk-update-users.input'
import { ImportUsersInput } from '../commands/import-users/import-users.input'
import { UserFiltersInput } from '../queries/get-users/user-filters.input'
import { CreateUserCommand } from '../commands/create-user/create-user.command'
import { UpdateUserCommand } from '../commands/update-user/update-user.command'
import { DeleteUserCommand } from '../commands/delete-user/delete-user.command'
import { BulkDeleteUsersCommand } from '../commands/bulk-delete-users/bulk-delete-users.command'
import { BulkUpdateUsersCommand } from '../commands/bulk-update-users/bulk-update-users.command'
import { ImportUsersCommand } from '../commands/import-users/import-users.command'
import { GetUsersQuery } from '../queries/get-users/get-users.query'
import { GetUserQuery } from '../queries/get-user/get-user.query'
import type { IUser, IImportUsersResult } from '../interfaces/people.interfaces'

@Resolver()
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [UserType])
  async getUsers(
    @CurrentUser() user: IJwtUser,
    @Args('filters', { type: () => UserFiltersInput, nullable: true }) filters: UserFiltersInput = {},
  ): Promise<IUser[]> {
    return this.queryBus.execute<GetUsersQuery, IUser[]>(
      new GetUsersQuery(user, filters),
    )
  }

  @Query(() => UserType, { nullable: true })
  async getUser(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<IUser | null> {
    return this.queryBus.execute<GetUserQuery, IUser | null>(
      new GetUserQuery(user, id),
    )
  }

  @Mutation(() => UserType)
  async createUser(
    @CurrentUser() user: IJwtUser,
    @Args('input', { type: () => CreateUserInput }) input: CreateUserInput,
  ): Promise<IUser> {
    return this.commandBus.execute<CreateUserCommand, IUser>(
      new CreateUserCommand(user, {
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role,
      }),
    )
  }

  @Mutation(() => UserType)
  async updateUser(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdateUserInput }) input: UpdateUserInput,
  ): Promise<IUser> {
    return this.commandBus.execute<UpdateUserCommand, IUser>(
      new UpdateUserCommand(user, id, {
        name: input.name,
        email: input.email,
        role: input.role,
      }),
    )
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute<DeleteUserCommand, void>(
      new DeleteUserCommand(user, id),
    )
    return true
  }

  @Mutation(() => Boolean)
  async bulkDeleteUsers(
    @CurrentUser() user: IJwtUser,
    @Args('input', { type: () => BulkDeleteUsersInput }) input: BulkDeleteUsersInput,
  ): Promise<boolean> {
    await this.commandBus.execute<BulkDeleteUsersCommand, void>(
      new BulkDeleteUsersCommand(user, input.ids),
    )
    return true
  }

  @Mutation(() => Boolean)
  async bulkUpdateUsers(
    @CurrentUser() user: IJwtUser,
    @Args('input', { type: () => BulkUpdateUsersInput }) input: BulkUpdateUsersInput,
  ): Promise<boolean> {
    await this.commandBus.execute<BulkUpdateUsersCommand, void>(
      new BulkUpdateUsersCommand(user, input.ids, input.role),
    )
    return true
  }

  @Mutation(() => ImportUsersResultType)
  async importUsers(
    @CurrentUser() user: IJwtUser,
    @Args('input', { type: () => ImportUsersInput }) input: ImportUsersInput,
  ): Promise<IImportUsersResult> {
    return this.commandBus.execute<ImportUsersCommand, IImportUsersResult>(
      new ImportUsersCommand(user, input.rows),
    )
  }
}
