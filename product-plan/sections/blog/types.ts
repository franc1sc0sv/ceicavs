export type UserRole = 'admin' | 'teacher' | 'student'
export type PostStatus = 'published' | 'draft' | 'rejected'
export type EmojiType = 'like' | 'love' | 'insightful' | 'funny' | 'celebrate'
export type DraftAction = 'approve' | 'reject'

/** A blog post category */
export interface BlogCategory {
  id: string
  name: string
  postCount: number
}

/** Aggregated reaction counts for a post */
export interface ReactionSummary {
  emoji: EmojiType
  count: number
  /** Whether the current user has reacted with this emoji */
  userReacted: boolean
}

/** Author information displayed on posts and comments */
export interface Author {
  id: string
  name: string
  role: UserRole
  avatarUrl?: string
}

/** A post preview shown in the feed */
export interface PostPreview {
  id: string
  title: string
  excerpt: string
  coverImageUrl?: string
  author: Author
  categories: BlogCategory[]
  reactions: ReactionSummary[]
  commentCount: number
  publishedAt: string
}

/** Full post detail */
export interface PostDetail {
  id: string
  title: string
  /** Rich text HTML content */
  content: string
  coverImageUrl?: string
  author: Author
  categories: BlogCategory[]
  reactions: ReactionSummary[]
  publishedAt: string
}

/** A GIF attachment from GIPHY */
export interface GifAttachment {
  id: string
  url: string
  alt: string
  width: number
  height: number
}

/** A comment on a post — supports two levels of threading */
export interface Comment {
  id: string
  author: Author
  text: string
  gif?: GifAttachment
  createdAt: string
  /** First-level replies */
  replies?: CommentReply[]
}

/** A reply to a comment — can have sub-replies (second level max) */
export interface CommentReply {
  id: string
  author: Author
  text: string
  gif?: GifAttachment
  createdAt: string
  /** Second-level sub-replies (max depth) */
  subReplies?: SubReply[]
}

/** A sub-reply (deepest level of threading) */
export interface SubReply {
  id: string
  author: Author
  text: string
  gif?: GifAttachment
  createdAt: string
}

/** A student's draft post */
export interface Draft {
  id: string
  title: string
  excerpt: string
  author: Author
  category: BlogCategory
  status: PostStatus
  submittedAt: string
  /** Rejection note from reviewer (if rejected) */
  rejectionNote?: string
}

/** Props for the blog feed view */
export interface BlogFeedProps {
  posts: PostPreview[]
  categories: BlogCategory[]
  searchQuery?: string
  selectedBlogCategoryId?: string | null
  /** Called when search input changes */
  onSearch?: (query: string) => void
  /** Called when a category filter is selected */
  onBlogCategoryFilter?: (categoryId: string | null) => void
  /** Called when a post card is clicked */
  onPostClick?: (postId: string) => void
  /** Called when "New Post" / "New Draft" button is clicked */
  onNewPost?: () => void
}

/** Props for the post detail/immersive view */
export interface PostDetailProps {
  post: PostDetail
  comments: Comment[]
  /** Called when a reaction emoji is toggled */
  onReact?: (emoji: EmojiType) => void
  /** Called when a new comment is submitted */
  onComment?: (text: string, gif?: GifAttachment) => void
  /** Called when replying to a comment */
  onReply?: (commentId: string, text: string, gif?: GifAttachment) => void
  /** Called when replying to a reply (sub-reply) */
  onSubReply?: (commentId: string, replyId: string, text: string, gif?: GifAttachment) => void
  /** Called to go back to the feed */
  onBack?: () => void
  /** Called when edit post is clicked (admin/teacher only) */
  onEdit?: (postId: string) => void
  /** Called when delete post is clicked (admin/teacher only) */
  onDelete?: (postId: string) => void
}

/** Props for the pending drafts queue (admin/teacher) */
export interface DraftQueueProps {
  drafts: Draft[]
  /** Called when a draft is approved */
  onApprove?: (draftId: string) => void
  /** Called when a draft is rejected */
  onReject?: (draftId: string, note?: string) => void
  /** Called when a draft is clicked to review */
  onDraftClick?: (draftId: string) => void
}

/** Props for the student's "My Drafts" view */
export interface MyDraftsProps {
  drafts: Draft[]
  /** Called when a draft is clicked */
  onDraftClick?: (draftId: string) => void
  /** Called when "New Draft" is clicked */
  onNewDraft?: () => void
}

/** Props for category management (admin/teacher) */
export interface BlogCategoryManagementProps {
  categories: BlogCategory[]
  /** Called when a category is created */
  onCreate?: (name: string) => void
  /** Called when a category is edited */
  onEdit?: (categoryId: string, name: string) => void
  /** Called when a category is deleted */
  onDelete?: (categoryId: string) => void
}

/** Top-level props for the Blog section */
export interface BlogProps {
  role: UserRole
  posts: PostPreview[]
  categories: BlogCategory[]
  /** Currently viewing post detail (if set) */
  selectedPost?: PostDetail
  /** Comments for the selected post */
  comments?: Comment[]
  /** Drafts for the queue or student's own */
  drafts?: Draft[]
  searchQuery?: string
  selectedBlogCategoryId?: string | null
  onSearch?: (query: string) => void
  onBlogCategoryFilter?: (categoryId: string | null) => void
  onPostClick?: (postId: string) => void
  onNewPost?: () => void
  onReact?: (emoji: EmojiType) => void
  onComment?: (text: string, gif?: GifAttachment) => void
  onReply?: (commentId: string, text: string, gif?: GifAttachment) => void
  onSubReply?: (commentId: string, replyId: string, text: string, gif?: GifAttachment) => void
  onBack?: () => void
  onEdit?: (postId: string) => void
  onDelete?: (postId: string) => void
  onApproveDraft?: (draftId: string) => void
  onRejectDraft?: (draftId: string, note?: string) => void
  onDraftClick?: (draftId: string) => void
  onCreateBlogCategory?: (name: string) => void
  onEditBlogCategory?: (categoryId: string, name: string) => void
  onDeleteBlogCategory?: (categoryId: string) => void
}
