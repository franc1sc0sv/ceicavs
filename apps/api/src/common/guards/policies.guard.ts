import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { CaslAbilityFactory } from '../../auth/casl-ability.factory'
import {
  CHECK_POLICIES_KEY,
  PolicyHandlerFn,
} from '../decorators/check-policies.decorator'

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const policyHandlers =
      this.reflector.get<PolicyHandlerFn[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) ?? []

    if (policyHandlers.length === 0) return true

    const ctx = GqlExecutionContext.create(context)
    const user = ctx.getContext().req.user

    if (!user) return false

    const ability = this.caslAbilityFactory.createForUser(user)
    return policyHandlers.every((handler) => handler(ability))
  }
}
