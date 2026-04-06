import { graphql } from '@/generated/gql'

export const LOGIN_MUTATION = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`)

export const REFRESH_TOKEN_MUTATION = graphql(`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
    }
  }
`)

export const ME_QUERY = graphql(`
  query Me {
    me {
      id
      email
      name
      role
      avatarUrl
    }
  }
`)
