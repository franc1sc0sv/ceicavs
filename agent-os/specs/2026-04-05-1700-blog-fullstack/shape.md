# Blog Fullstack — Shaping Notes

## Scope

Full end-to-end blog/CMS feature for CEICAVS school platform. Covers:
- Post feed with search and category filtering
- Post detail with reactions (5 emoji types) and threaded comments (2 levels)
- Create/edit post with rich text editor (Tiptap)
- Draft submission workflow: students submit → admin/teacher approve or reject with note
- Draft queue page (admin/teacher) and My Drafts page (student)
- Category management (admin only)

## Decisions

- DB schema is complete — no migration needed
- PostCard and BlogFeed from `product-plan/sections/blog/components/` are the authoritative UI design reference
- Rich text editor: Tiptap (check if already in deps; add if missing)
- Reactions: toggle pattern — same emoji removes it, different emoji replaces it
- Comment threading: max 1 level deep (reply to reply not allowed)
- Admin/Teacher publish directly (status=published); Student always creates draft (status=draft)
- CASL authorization inside every handler — no exceptions
- All repository methods require `tx: TxClient` — never optional

## Context

- **Visuals:** ASCII mockups in `visuals/mockups.md` (6 screens: feed, detail, create/edit, draft queue, my drafts, category management)
- **References:** Auth module studied — `apps/api/src/modules/auth/`
- **Product alignment:** Wave 5 of implementation plan; Spanish-first UI, English codebase

## Standards Applied

- `backend/cqrs-patterns` — transaction-first, CASL inside handlers, thin resolvers, event emission after commit
- `database/prisma-kysely-patterns` — TxClient contract, snake_case mapping, soft delete (manual `deletedAt: null` filtering)
- `frontend/architecture-patterns` — feature-first folders, four-state rendering, CASL visibility, named exports
- `frontend/design-system` — indigo primary, role badge colors, dark mode `dark:` variants, Inter font
