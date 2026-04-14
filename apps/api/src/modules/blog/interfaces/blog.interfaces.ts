import type { PostStatus } from '@ceicavs/db'

export type { PostStatus }

export interface IPost {
  id: string
  title: string
  excerpt: string
  content: string
  status: PostStatus
  authorId: string
  rejectionNote: string | null
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface ICategory {
  id: string
  name: string
  deletedAt: Date | null
}

export interface IReaction {
  id: string
  postId: string | null
  commentId: string | null
  userId: string
  emoji: string
}

export interface IComment {
  id: string
  postId: string
  authorId: string
  text: string
  gifUrl: string | null
  gifAlt: string | null
  depth: number
  parentId: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface IPostImageInput {
  url: string
  publicId: string
  order: number
}

export interface ICreatePostData {
  title: string
  excerpt: string
  content: string
  categoryIds: string[]
  publish: boolean
  images?: IPostImageInput[]
}

export interface IUpdatePostData {
  title?: string
  excerpt?: string
  content?: string
  categoryIds?: string[]
  images?: IPostImageInput[]
  publish?: boolean
}

export interface IPostFilters {
  search?: string
  categoryId?: string
  status?: PostStatus
  authorId?: string
}

export type DraftAction = 'approve' | 'reject'

export interface IReviewDraftData {
  action: DraftAction
  rejectionNote?: string
}

export interface IReactionSummary {
  emoji: string
  count: number
  userReacted: boolean
}

export interface IAuthor {
  id: string
  name: string
  avatarUrl: string | null
  role: string
}

export interface IPostImage {
  id: string
  url: string
  publicId: string
  order: number
}

export interface IPostWithRelations extends IPost {
  author: IAuthor
  categories: ICategory[]
  reactionSummary: IReactionSummary[]
  commentCount: number
  comments?: ICommentWithAuthor[]
  images?: IPostImage[]
}

export interface ICommentWithAuthor extends IComment {
  author: IAuthor
  replyCount?: number
  reactionSummary?: IReactionSummary[]
}
