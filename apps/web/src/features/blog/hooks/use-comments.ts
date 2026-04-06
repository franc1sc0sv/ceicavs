import { useMutation } from '@apollo/client/react'
import { ADD_COMMENT, UPDATE_COMMENT, DELETE_COMMENT } from '../graphql/blog.mutations'
import { GET_COMMENTS } from '../graphql/blog.queries'

export function useComments(postId: string) {
  const refetchOptions = {
    refetchQueries: [{ query: GET_COMMENTS, variables: { postId, cursor: null, limit: 10 } }],
  }

  const [addComment, { loading: adding }] = useMutation(ADD_COMMENT, refetchOptions)
  const [updateComment, { loading: updating }] = useMutation(UPDATE_COMMENT, refetchOptions)
  const [deleteComment, { loading: deleting }] = useMutation(DELETE_COMMENT, refetchOptions)

  return {
    addComment,
    updateComment,
    deleteComment,
    adding,
    updating,
    deleting,
  }
}
