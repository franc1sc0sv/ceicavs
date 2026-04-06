import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'
import type { IJwtUser } from '../../../common/types'
import { GroupType } from '../types/group.type'
import { GroupWithMembersType } from '../types/group-with-members.type'
import { CreateGroupInput } from '../commands/create-group/create-group.input'
import { UpdateGroupInput } from '../commands/update-group/update-group.input'
import { GroupFiltersInput } from '../queries/get-groups/group-filters.input'
import { CreateGroupCommand } from '../commands/create-group/create-group.command'
import { UpdateGroupCommand } from '../commands/update-group/update-group.command'
import { DeleteGroupCommand } from '../commands/delete-group/delete-group.command'
import { AddMemberToGroupCommand } from '../commands/add-member-to-group/add-member-to-group.command'
import { RemoveMemberFromGroupCommand } from '../commands/remove-member-from-group/remove-member-from-group.command'
import { GetGroupsQuery } from '../queries/get-groups/get-groups.query'
import { GetGroupQuery } from '../queries/get-group/get-group.query'
import type { IGroup, IGroupMember } from '../interfaces/people.interfaces'

@Resolver()
@UseGuards(JwtAuthGuard)
export class GroupResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [GroupType])
  async getGroups(
    @CurrentUser() user: IJwtUser,
    @Args('filters', { type: () => GroupFiltersInput, nullable: true }) filters: GroupFiltersInput = {},
  ): Promise<IGroup[]> {
    return this.queryBus.execute<GetGroupsQuery, IGroup[]>(
      new GetGroupsQuery(user, filters),
    )
  }

  @Query(() => GroupWithMembersType, { nullable: true })
  async getGroup(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<(IGroup & { members: IGroupMember[] }) | null> {
    return this.queryBus.execute<GetGroupQuery, (IGroup & { members: IGroupMember[] }) | null>(
      new GetGroupQuery(user, id),
    )
  }

  @Mutation(() => GroupType)
  async createGroup(
    @CurrentUser() user: IJwtUser,
    @Args('input', { type: () => CreateGroupInput }) input: CreateGroupInput,
  ): Promise<IGroup> {
    return this.commandBus.execute<CreateGroupCommand, IGroup>(
      new CreateGroupCommand(user, {
        name: input.name,
        description: input.description,
      }),
    )
  }

  @Mutation(() => GroupType)
  async updateGroup(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdateGroupInput }) input: UpdateGroupInput,
  ): Promise<IGroup> {
    return this.commandBus.execute<UpdateGroupCommand, IGroup>(
      new UpdateGroupCommand(user, id, {
        name: input.name,
        description: input.description,
      }),
    )
  }

  @Mutation(() => Boolean)
  async deleteGroup(
    @CurrentUser() user: IJwtUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute<DeleteGroupCommand, void>(
      new DeleteGroupCommand(user, id),
    )
    return true
  }

  @Mutation(() => Boolean)
  async addMemberToGroup(
    @CurrentUser() user: IJwtUser,
    @Args('groupId', { type: () => ID }) groupId: string,
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<boolean> {
    await this.commandBus.execute<AddMemberToGroupCommand, void>(
      new AddMemberToGroupCommand(user, groupId, userId),
    )
    return true
  }

  @Mutation(() => Boolean)
  async removeMemberFromGroup(
    @CurrentUser() user: IJwtUser,
    @Args('groupId', { type: () => ID }) groupId: string,
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<boolean> {
    await this.commandBus.execute<RemoveMemberFromGroupCommand, void>(
      new RemoveMemberFromGroupCommand(user, groupId, userId),
    )
    return true
  }
}
