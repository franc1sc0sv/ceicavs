import { createContext, useContext, ReactNode } from 'react'
import { createContextualCan } from '@casl/react'
import { defineAbilityFor, AppAbility } from '@ceicavs/shared'
import type { UserRole } from '@ceicavs/shared'

const AbilityContext = createContext<AppAbility>(defineAbilityFor('student'))

export const Can = createContextualCan(AbilityContext.Consumer)

interface AbilityProviderProps {
  role: UserRole
  children: ReactNode
}

export function AbilityProvider({ role, children }: AbilityProviderProps) {
  const ability = defineAbilityFor(role)
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}

export function useAbility(): AppAbility {
  return useContext(AbilityContext)
}
