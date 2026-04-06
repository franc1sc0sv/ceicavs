import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_GROUPS } from '../graphql/people.operations'

interface GroupFilters {
  search: string
}

interface GroupsData {
  getGroups: { id: string; name: string; description: string | null; memberCount: number }[]
}

export function usePeopleGroups() {
  const [filters, setFilters] = useState<GroupFilters>({ search: '' })

  const { data, loading, error, refetch } = useQuery(GET_GROUPS, {
    variables: {
      filters: {
        search: filters.search || undefined,
      },
    },
  })
  const typed = data as GroupsData | undefined

  const groups = typed?.getGroups ?? []

  return {
    groups,
    loading,
    error,
    refetch,
    filters,
    setFilters,
  }
}
