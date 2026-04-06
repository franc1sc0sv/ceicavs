import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_USERS } from '../graphql/people.operations'
import type { UserRole } from '@ceicavs/shared'

interface UserFilters {
  search: string
  role: UserRole | ''
  groupId: string
}

interface UsersData {
  getUsers: { id: string; name: string; email: string; role: string; avatarUrl: string | null; groups: { id: string; name: string }[] }[]
}

export function usePeopleUsers(isDeactivated = false) {
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    groupId: '',
  })

  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: {
      filters: {
        search: filters.search || undefined,
        role: filters.role || undefined,
        groupId: filters.groupId || undefined,
        isDeactivated: isDeactivated || undefined,
      },
    },
    fetchPolicy: 'cache-and-network',
  })
  const typed = data as UsersData | undefined

  return {
    users: typed?.getUsers ?? [],
    loading,
    error,
    refetch,
    filters,
    setFilters,
  }
}
