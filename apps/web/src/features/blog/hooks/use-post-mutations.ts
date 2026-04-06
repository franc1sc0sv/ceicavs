import { useMutation } from '@apollo/client/react'
import { CREATE_POST, UPDATE_POST, DELETE_POST } from '../graphql/blog.mutations'
import { GET_POSTS, GET_MY_DRAFTS } from '../graphql/blog.queries'

export function usePostMutations() {
  const [createPost, { loading: creating }] = useMutation(CREATE_POST, {
    refetchQueries: [GET_POSTS, GET_MY_DRAFTS],
  })

  const [updatePost, { loading: updating }] = useMutation(UPDATE_POST, {
    refetchQueries: [GET_POSTS, GET_MY_DRAFTS],
  })

  const [deletePost, { loading: deleting }] = useMutation(DELETE_POST, {
    refetchQueries: [GET_POSTS],
  })

  return {
    createPost,
    updatePost,
    deletePost,
    creating,
    updating,
    deleting,
  }
}
