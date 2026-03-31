# Blog

## Overview

A full content management system with a social-media-style feed, rich text editor, emoji reactions, and threaded comments with GIPHY GIF support. Admins and teachers publish posts directly, while students submit drafts that go through a separate approval queue. Posts are filterable by search bar and category.

## Components Provided

- `BlogFeed` — Scrollable timeline of post preview cards with search bar and category filter at the top. Each card shows title, excerpt, author, date, category badge, and reaction summary.
- `PostCard` — A single post preview card in the feed displaying cover image (optional), title, excerpt, author avatar and name, date, category badge, and top 3 reaction emojis with counts.

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onSearch(query: string)` | User types in the search bar to filter posts by title or content |
| `onBlogCategoryFilter(categoryId: string \| null)` | User selects or clears a category filter |
| `onPostClick(postId: string)` | User clicks a post card to open the full reading view |
| `onNewPost()` | User clicks "New Post" (admin/teacher) or "New Draft" (student) |
| `onReact(emoji: EmojiType)` | User toggles a reaction emoji on a post in the detail view |
| `onComment(text: string, gif?: GifAttachment)` | User submits a new top-level comment on a post |
| `onReply(commentId: string, text: string, gif?: GifAttachment)` | User replies to an existing comment (first-level threading) |
| `onSubReply(commentId: string, replyId: string, text: string, gif?: GifAttachment)` | User replies to a reply (second-level threading, max depth) |
| `onBack()` | User navigates back from post detail to the feed |
| `onEdit(postId: string)` | Admin/teacher clicks "Edit" on a post |
| `onDelete(postId: string)` | Admin/teacher clicks "Delete" on a post |
| `onApproveDraft(draftId: string)` | Admin/teacher approves a pending draft in the queue |
| `onRejectDraft(draftId: string, note?: string)` | Admin/teacher rejects a draft with an optional rejection note |
| `onDraftClick(draftId: string)` | User clicks a draft to review or view its content |
| `onCreateBlogCategory(name: string)` | Admin/teacher creates a new blog category |
| `onEditBlogCategory(categoryId: string, name: string)` | Admin/teacher renames a category |
| `onDeleteBlogCategory(categoryId: string)` | Admin/teacher deletes a category |

## Data Shapes

**`PostPreview`** — Feed card data: `id`, `title`, `excerpt`, `coverImageUrl?`, `author` (Author), `categories` (BlogCategory[]), `reactions` (ReactionSummary[]), `commentCount`, `publishedAt`.

**`PostDetail`** — Full post: `id`, `title`, `content` (rich HTML), `coverImageUrl?`, `author`, `categories`, `reactions`, `publishedAt`.

**`Comment`** — Top-level comment: `id`, `author`, `text`, `gif?`, `createdAt`, `replies?` (CommentReply[]).

**`CommentReply`** — First-level reply: `id`, `author`, `text`, `gif?`, `createdAt`, `subReplies?` (SubReply[]).

**`SubReply`** — Second-level reply (max depth): `id`, `author`, `text`, `gif?`, `createdAt`.

**`Draft`** — Student draft: `id`, `title`, `excerpt`, `author`, `category`, `status` (published/draft/rejected), `submittedAt`, `rejectionNote?`.

**`BlogCategory`** — A category: `id`, `name`, `postCount`.

**`ReactionSummary`** — Emoji reaction aggregate: `emoji` (like/love/insightful/funny/celebrate), `count`, `userReacted`.

**`GifAttachment`** — A GIPHY GIF: `id`, `url`, `alt`, `width`, `height`.

**`BlogProps`** — Top-level: `role`, `posts`, `categories`, `selectedPost?`, `comments?`, `drafts?`, `searchQuery?`, `selectedBlogCategoryId?`, plus all callbacks.

See `types.ts` for full interface definitions.
