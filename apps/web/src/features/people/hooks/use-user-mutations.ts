import { useMutation } from '@apollo/client/react'
import type {
  CreateUserInput,
  UpdateUserInput,
  BulkDeleteUsersInput,
  BulkUpdateUsersInput,
  ImportUsersInput,
} from '@/generated/graphql'
import {
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  BULK_DELETE_USERS,
  BULK_UPDATE_USERS,
  IMPORT_USERS,
} from '../graphql/people.operations'

export function useUserMutations() {
  const [createUserMutation, { loading: creating }] = useMutation(CREATE_USER, {
    refetchQueries: ['GetUsers'],
  })

  const [updateUserMutation, { loading: updating }] = useMutation(UPDATE_USER, {
    refetchQueries: ['GetUsers'],
  })

  const [deleteUserMutation, { loading: deleting }] = useMutation(DELETE_USER, {
    refetchQueries: ['GetUsers'],
  })

  const [bulkDeleteMutation, { loading: bulkDeleting }] = useMutation(BULK_DELETE_USERS, {
    refetchQueries: ['GetUsers'],
  })

  const [bulkUpdateMutation, { loading: bulkUpdating }] = useMutation(BULK_UPDATE_USERS, {
    refetchQueries: ['GetUsers'],
  })

  const [importUsersMutation, { loading: importing }] = useMutation(IMPORT_USERS, {
    refetchQueries: ['GetUsers'],
  })

  const createUser = (input: CreateUserInput) =>
    createUserMutation({ variables: { input } })

  const updateUser = (id: string, input: UpdateUserInput) =>
    updateUserMutation({ variables: { id, input } })

  const deleteUser = (id: string) =>
    deleteUserMutation({ variables: { id } })

  const bulkDeleteUsers = (input: BulkDeleteUsersInput) =>
    bulkDeleteMutation({ variables: { input } })

  const bulkUpdateUsers = (input: BulkUpdateUsersInput) =>
    bulkUpdateMutation({ variables: { input } })

  const importUsers = (input: ImportUsersInput) =>
    importUsersMutation({ variables: { input } })

  return {
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    bulkUpdateUsers,
    importUsers,
    loading: creating || updating || deleting || bulkDeleting || bulkUpdating || importing,
  }
}
