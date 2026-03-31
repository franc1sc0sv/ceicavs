# Milestone 5: Blog

Provide alongside: `product-overview.md`

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Goal

Build a full content management system with a social-media-style feed, rich text editor, emoji reactions, threaded comments with GIPHY GIF support, and a draft approval workflow. All roles can read and interact with posts; admins and teachers publish directly; students submit drafts that require approval.

## Overview

The Blog section contains multiple views: a post feed with search and category filtering, an immersive post detail view with reactions and comments, a rich text editor for creating/editing posts, a "My Drafts" view for students, a "Pending Drafts" approval queue for admins/teachers, and a category management panel. Threading supports two levels: comment, reply, and sub-reply.

## Key Functionality

- **Post feed**: scrollable timeline of preview cards, each showing optional cover image, title, excerpt (first ~2 lines), author avatar + name, date, category badge, and reaction summary (top 3 emojis with counts)
- **Search and filter**: text search bar (searches title and content) plus category selector (dropdown or chip group) at the top of the feed
- **Post detail (immersive view)**: clean wide-content layout with full rich text content, author info, floating emoji reaction bar, and comments section below
- **Reactions**: emoji picker with types (like, love, insightful, funny, celebrate); clicking adds/toggles the user's reaction; each shows count; a user can react with multiple different emojis on one post
- **Comments**: two-level threading (comment -> reply -> sub-reply, no deeper); each shows author avatar, name, role badge, text, optional GIF, timestamp, and reply button
- **GIF picker**: text input in the comment composer triggers a GIPHY search overlay; type to search, click a GIF to attach
- **Rich text editor**: toolbar with bold, italic, headings (H1-H3), bullet/numbered lists, links, image upload, code blocks, tables, YouTube/embed insertion, horizontal divider
- **New Post (admin/teacher)**: editor + category multi-select + publish button
- **New Draft (student)**: same editor but submits as a draft (pending approval)
- **My Drafts (student)**: list of their drafts with title, submission date, and status badge (pending = amber, approved = green, rejected = red), optional rejection note
- **Pending Drafts queue (admin/teacher)**: list of all pending drafts with author name, title, submission date; click to open and review; approve or reject (with optional rejection note)
- **Category management (admin/teacher)**: simple list of categories with create, edit, and delete actions
- **Admin can edit/delete any post; teachers can edit/delete only their own**

## Components Provided

| File | Description |
|------|-------------|
| `sections/blog/components/BlogFeed.tsx` | Post feed with search bar, category filter, and post cards |
| `sections/blog/components/PostCard.tsx` | Single post preview card |
| `sections/blog/components/index.ts` | Barrel exports |

## Props Reference

### BlogProps (top-level)

| Prop | Type | Description |
|------|------|-------------|
| `role` | `UserRole` | `'admin' \| 'teacher' \| 'student'` |
| `posts` | `PostPreview[]` | Published posts for the feed |
| `categories` | `BlogCategory[]` | Available categories |
| `selectedPost` | `PostDetail` | Currently viewing post (if detail view open) |
| `comments` | `Comment[]` | Comments for the selected post |
| `drafts` | `Draft[]` | Drafts (queue for admin/teacher, own for student) |
| `searchQuery` | `string` | Current search text |
| `selectedBlogCategoryId` | `string \| null` | Active category filter |
| `onSearch` | `(query: string) => void` | Search input change |
| `onBlogCategoryFilter` | `(categoryId: string \| null) => void` | Category filter change |
| `onPostClick` | `(postId: string) => void` | Post card clicked |
| `onNewPost` | `() => void` | New Post / New Draft button clicked |
| `onReact` | `(emoji: EmojiType) => void` | Reaction toggled on selected post |
| `onComment` | `(text: string, gif?: GifAttachment) => void` | New comment submitted |
| `onReply` | `(commentId: string, text: string, gif?: GifAttachment) => void` | Reply to a comment |
| `onSubReply` | `(commentId: string, replyId: string, text: string, gif?: GifAttachment) => void` | Sub-reply to a reply |
| `onBack` | `() => void` | Back to feed from detail |
| `onEdit` | `(postId: string) => void` | Edit post (admin/teacher) |
| `onDelete` | `(postId: string) => void` | Delete post (admin/teacher) |
| `onApproveDraft` | `(draftId: string) => void` | Approve a pending draft |
| `onRejectDraft` | `(draftId: string, note?: string) => void` | Reject a draft with optional note |
| `onDraftClick` | `(draftId: string) => void` | Open a draft for review |
| `onCreateBlogCategory` | `(name: string) => void` | Create a category |
| `onEditBlogCategory` | `(categoryId: string, name: string) => void` | Edit a category |
| `onDeleteBlogCategory` | `(categoryId: string) => void` | Delete a category |

### PostPreview data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Post identifier |
| `title` | `string` | Post title |
| `excerpt` | `string` | First ~2 lines of content |
| `coverImageUrl` | `string` | Optional cover image |
| `author` | `Author` | `{ id, name, role, avatarUrl? }` |
| `categories` | `BlogCategory[]` | Assigned categories |
| `reactions` | `ReactionSummary[]` | `{ emoji, count, userReacted }` |
| `commentCount` | `number` | Total comments |
| `publishedAt` | `string` | ISO timestamp |

### Comment data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Comment identifier |
| `author` | `Author` | Comment author with role badge |
| `text` | `string` | Comment text |
| `gif` | `GifAttachment` | Optional GIPHY GIF `{ id, url, alt, width, height }` |
| `createdAt` | `string` | ISO timestamp |
| `replies` | `CommentReply[]` | First-level replies (each can have `subReplies`) |

### Key enums

- `EmojiType`: `'like' | 'love' | 'insightful' | 'funny' | 'celebrate'`
- `PostStatus`: `'published' | 'draft' | 'rejected'`
- `DraftAction`: `'approve' | 'reject'`

## Expected User Flows

### Flow 1: User reads and interacts with a post
1. User opens Blog and sees a feed of post preview cards sorted newest-first
2. User filters by category using the chip selector at the top
3. User clicks a post card to open the immersive reading view
4. User clicks the "love" emoji in the reaction bar — the count increments, `onReact('love')` fires
5. User writes a comment and attaches a GIF from the GIPHY picker — `onComment` fires

### Flow 2: Teacher publishes a new post
1. Teacher clicks "New Post" from the feed
2. Teacher uses the rich text editor to write content with formatting, images, and embedded video
3. Teacher selects categories from the multi-select
4. Teacher clicks "Publish" — `onNewPost` fires, post appears in the feed

### Flow 3: Student submits and tracks a draft
1. Student clicks "New Draft" from the feed
2. Student writes their post using the rich text editor
3. Student clicks "Submit Draft" — the post is saved as pending
4. Student navigates to "My Drafts" and sees the draft with a "Pending" amber badge
5. Later, the badge updates to "Approved" (green) or "Rejected" (red, with a rejection note)

### Flow 4: Admin reviews pending drafts
1. Admin opens the "Pending Drafts" queue and sees a list of student submissions
2. Admin clicks a draft to read its full content
3. Admin clicks "Approve" — `onApproveDraft` fires, draft is published to the feed
4. Alternatively, admin clicks "Reject", types an optional note, and confirms — `onRejectDraft` fires

## Empty States

- **No posts in feed**: "No hay publicaciones aun" / "No posts yet" with a CTA to create the first post (admin/teacher) or a message that posts are coming soon (student)
- **No comments on post**: "Se el primero en comentar" / "Be the first to comment" below the post content
- **No search results**: "No se encontraron publicaciones" / "No posts found" with a suggestion to adjust search or filters
- **No pending drafts**: "No hay borradores pendientes" / "No pending drafts" in the approval queue
- **No student drafts**: "No has enviado borradores" / "You haven't submitted any drafts" with a CTA to create one

## Testing

Refer to `sections/blog/tests.md` for detailed test specs covering:
- Feed renders with correct post cards
- Search and category filtering
- Post detail view with reactions and comments
- Comment threading (2 levels)
- GIF attachment in comments
- Rich text editor toolbar
- Draft submission and status tracking
- Approval queue approve/reject flow
- Category management CRUD

## Files to Reference

| File | Purpose |
|------|---------|
| `product/sections/blog/spec.md` | Full section specification |
| `product/sections/blog/types.ts` | TypeScript interfaces |
| `product/sections/blog/data.json` | Sample data |
| `sections/blog/components/BlogFeed.tsx` | Blog feed component |
| `sections/blog/components/PostCard.tsx` | Post preview card component |

## Done When

- [ ] Blog section renders inside the AppShell
- [ ] Post feed displays preview cards with title, excerpt, author, date, category badge, and reaction summary
- [ ] Search bar filters posts by title and content
- [ ] Category selector filters posts by category
- [ ] Clicking a post card opens the immersive detail view
- [ ] Reaction bar displays available emojis with counts; clicking toggles the user's reaction
- [ ] Comments section shows threaded comments with two levels (comment -> reply -> sub-reply)
- [ ] Each comment displays author avatar, name, role badge, text, optional GIF, and timestamp
- [ ] GIF picker searches GIPHY and attaches a GIF to the comment
- [ ] Rich text editor has toolbar with bold, italic, headings, lists, links, images, code blocks, tables, embeds, dividers
- [ ] Admin/Teacher can publish posts directly
- [ ] Student submits posts as drafts (pending approval)
- [ ] "My Drafts" view shows student's drafts with status badges (pending/approved/rejected)
- [ ] Rejected drafts display the rejection note
- [ ] "Pending Drafts" queue lists submissions for admin/teacher review
- [ ] Approve and reject actions fire correct callbacks
- [ ] Category management supports create, edit, and delete
- [ ] Admin can edit/delete any post; teacher can edit/delete only their own
- [ ] All empty states display with appropriate messages
