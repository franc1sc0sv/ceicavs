import { useMutation } from '@apollo/client/react'
import type { CreateGroupInput, UpdateGroupInput } from '@/generated/graphql'
import {
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  ADD_MEMBER,
  REMOVE_MEMBER,
  GET_GROUP,
} from '../graphql/people.operations'

export function useGroupMutations() {
  const [createGroupMutation, { loading: creating }] = useMutation(CREATE_GROUP, {
    refetchQueries: ['GetGroups'],
  })

  const [updateGroupMutation, { loading: updating }] = useMutation(UPDATE_GROUP, {
    refetchQueries: ['GetGroups'],
  })

  const [deleteGroupMutation, { loading: deleting }] = useMutation(DELETE_GROUP, {
    refetchQueries: ['GetGroups'],
  })

  const [addMemberMutation, { loading: addingMember }] = useMutation(ADD_MEMBER, {
    refetchQueries: 'active',
  })

  const [removeMemberMutation, { loading: removingMember }] = useMutation(REMOVE_MEMBER, {
    refetchQueries: 'active',
  })

  const createGroup = (input: CreateGroupInput) =>
    createGroupMutation({ variables: { input } })

  const updateGroup = (id: string, input: UpdateGroupInput) =>
    updateGroupMutation({ variables: { id, input } })

  const deleteGroup = (id: string) =>
    deleteGroupMutation({ variables: { id } })

  const addMember = (groupId: string, userId: string) =>
    addMemberMutation({
      variables: { groupId, userId },
      refetchQueries: [{ query: GET_GROUP, variables: { id: groupId } }],
    })

  const removeMember = (groupId: string, userId: string) =>
    removeMemberMutation({
      variables: { groupId, userId },
      refetchQueries: [{ query: GET_GROUP, variables: { id: groupId } }],
    })

  return {
    createGroup,
    updateGroup,
    deleteGroup,
    addMember,
    removeMember,
    loading: creating || updating || deleting || addingMember || removingMember,
  }
}
