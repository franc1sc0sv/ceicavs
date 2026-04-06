import { useQuery, useMutation } from '@apollo/client/react'
import { GET_CATEGORIES } from '../graphql/blog.queries'
import { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '../graphql/blog.mutations'

interface CategoriesData {
  categories: { id: string; name: string }[]
}

export function useCategories() {
  const { data, loading, error } = useQuery(GET_CATEGORIES)
  const typed = data as CategoriesData | undefined

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
  })

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
  })

  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
  })

  return {
    categories: typed?.categories ?? [],
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    creating,
    updating,
    deleting,
  }
}
