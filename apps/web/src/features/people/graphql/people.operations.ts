import { graphql } from '@/generated/gql'

export const GET_USERS = graphql(`
  query GetUsers($filters: UserFiltersInput) {
    getUsers(filters: $filters) {
      id
      name
      email
      role
      avatarUrl
      createdAt
      groups {
        id
        name
      }
    }
  }
`)

export const GET_USER = graphql(`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      role
      avatarUrl
      createdAt
      groups {
        id
        name
      }
    }
  }
`)

export const GET_GROUPS = graphql(`
  query GetGroups($filters: GroupFiltersInput) {
    getGroups(filters: $filters) {
      id
      name
      description
      memberCount
      createdBy
      createdAt
    }
  }
`)

export const GET_GROUP = graphql(`
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      name
      description
      memberCount
      createdBy
      createdAt
      members {
        id
        name
        email
        role
        avatarUrl
        joinedAt
      }
    }
  }
`)

export const CREATE_USER = graphql(`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
    }
  }
`)

export const UPDATE_USER = graphql(`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      role
    }
  }
`)

export const DELETE_USER = graphql(`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`)

export const BULK_DELETE_USERS = graphql(`
  mutation BulkDeleteUsers($input: BulkDeleteUsersInput!) {
    bulkDeleteUsers(input: $input)
  }
`)

export const BULK_UPDATE_USERS = graphql(`
  mutation BulkUpdateUsers($input: BulkUpdateUsersInput!) {
    bulkUpdateUsers(input: $input)
  }
`)

export const IMPORT_USERS = graphql(`
  mutation ImportUsers($input: ImportUsersInput!) {
    importUsers(input: $input) {
      created
      skipped
      errors
    }
  }
`)

export const CREATE_GROUP = graphql(`
  mutation CreateGroup($input: CreateGroupInput!) {
    createGroup(input: $input) {
      id
      name
      description
    }
  }
`)

export const UPDATE_GROUP = graphql(`
  mutation UpdateGroup($id: ID!, $input: UpdateGroupInput!) {
    updateGroup(id: $id, input: $input) {
      id
      name
      description
    }
  }
`)

export const DELETE_GROUP = graphql(`
  mutation DeleteGroup($id: ID!) {
    deleteGroup(id: $id)
  }
`)

export const ADD_MEMBER = graphql(`
  mutation AddMemberToGroup($groupId: ID!, $userId: ID!) {
    addMemberToGroup(groupId: $groupId, userId: $userId)
  }
`)

export const REMOVE_MEMBER = graphql(`
  mutation RemoveMemberFromGroup($groupId: ID!, $userId: ID!) {
    removeMemberFromGroup(groupId: $groupId, userId: $userId)
  }
`)
