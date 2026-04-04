import { Resolver, Mutation, Query, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'
import type { IJwtUser } from '../../../common/types'
import { AuthTokensType } from '../types/auth-tokens.type'
import { UserProfileType } from '../types/user-profile.type'
import { LoginInput } from '../types/login.input'
import { RefreshTokenInput } from '../types/refresh-token.input'
import { LoginCommand } from '../commands/login/login.command'
import { RefreshTokenCommand } from '../commands/refresh-token/refresh-token.command'
import { GetMeQuery } from '../queries/get-me/get-me.query'
import type { IAuthTokens, IAuthUser } from '../interfaces/auth.interfaces'

@Resolver()
export class AuthResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => AuthTokensType)
  async login(
    @Args('input', { type: () => LoginInput }) input: LoginInput,
  ): Promise<IAuthTokens> {
    return this.commandBus.execute<LoginCommand, IAuthTokens>(
      new LoginCommand(input.email, input.password),
    )
  }

  @Mutation(() => AuthTokensType)
  async refreshToken(
    @Args('input', { type: () => RefreshTokenInput }) input: RefreshTokenInput,
  ): Promise<IAuthTokens> {
    return this.commandBus.execute<RefreshTokenCommand, IAuthTokens>(
      new RefreshTokenCommand(input.refreshToken),
    )
  }

  @Query(() => UserProfileType)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: IJwtUser): Promise<IAuthUser> {
    return this.queryBus.execute<GetMeQuery, IAuthUser>(
      new GetMeQuery(user.id, user.role),
    )
  }
}
