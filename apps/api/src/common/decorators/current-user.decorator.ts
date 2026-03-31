import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { AuthUser } from '../types'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const gqlCtx = GqlExecutionContext.create(ctx)
    return gqlCtx.getContext().req.user
  },
)
