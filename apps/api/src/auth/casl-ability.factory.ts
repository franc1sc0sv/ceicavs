import { Injectable } from '@nestjs/common'
import { defineAbilityFor, AppAbility } from '@ceicavs/shared'
import type { AuthUser } from '../common/types'

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: AuthUser): AppAbility {
    return defineAbilityFor(user.role)
  }
}
