# CEICAVS

## Description

An integral school management platform for Centro Escolar CEICAVS that modernizes administrative and academic operations. It digitizes group-based attendance tracking, provides a full blog platform with moderated student contributions, centralizes teaching tools, manages people (students, teachers, admins), and leverages AI to transcribe and analyze audio recordings -- all with role-based access, multi-language support (Spanish/English), and dark/light mode.

## Roles

### Admin
Full platform control. Can manage all users, create and oversee any attendance group, publish and moderate all blog content (including approving student drafts), access all teaching tools, and use AI transcription with visibility into all recordings.

### Teacher
Classroom-focused access. Can only see and manage their own groups in the People section (cannot see full user list or other teachers' groups). Can mark attendance for their groups, publish blog posts, approve student drafts from their class, comment and react on all posts, use all teaching tools, and record/transcribe their own audio (private to them).

### Student
Consumer-level access. Can view their own attendance history across all groups they belong to, read blog posts, comment and react with GIF support, submit blog post drafts that require teacher/admin approval, and use teaching tools. Cannot access People management or AI Transcription.

## Sidebar Visibility by Role

- **Admin:** Dashboard, Attendance, People, Blog, Teaching Tools, AI Transcription (all 6)
- **Teacher:** Dashboard, Attendance, People, Blog, Teaching Tools, AI Transcription (all 6)
- **Student:** Dashboard, Attendance, Blog, Teaching Tools (4 sections -- People and AI Transcription hidden)

## Sections

| # | Section           | Description                                                      |
|---|-------------------|------------------------------------------------------------------|
| 1 | **Dashboard**     | Role-specific overview with stats, activity feed, and quick actions |
| 2 | **Attendance**    | Group-based attendance tracking with roster, reports, and exports  |
| 3 | **People**        | User and group management with roles and permissions (admin/teacher) |
| 4 | **Blog**          | Posts, categories, reactions, threaded comments, draft approvals   |
| 5 | **Teaching Tools**| Categorized classroom utilities with favorites                    |
| 6 | **AI Transcription** | Audio recording/upload with AI-generated transcripts and summaries |

## Design System

### Colors
- **Primary:** indigo
- **Secondary:** amber
- **Neutral:** slate

### Light Mode
- Accent: `indigo-600`
- Background: `slate-50`
- Surface: `white`
- Text: `slate-900`
- Border: `slate-200`

### Dark Mode
- Accent: `indigo-400`
- Background: `slate-950`
- Surface: `slate-900`
- Text: `slate-100`
- Border: `slate-800`

### Typography
- **Heading & Body:** Inter (400, 500, 600, 700)
- **Monospace:** JetBrains Mono (400, 500)

## Core Entities

### Shared / People
- `User` -- Platform user with name, email, role, and group memberships
- `Role` -- Named role (admin, teacher, student) with user count
- `Permission` -- Granular permission key assigned to roles
- `GroupSummary` -- Lightweight group reference (id + name)
- `Group` -- Full group record with description and member count

### Dashboard
- `StatCard` -- Summary statistic card with optional trend indicator
- `ActivityItem` -- Activity feed entry (attendance, post, registration, etc.)
- `QuickAction` -- Shortcut button linking to a section or action
- `DraftStatus` -- Student's blog draft with approval status
- `RecentPost` -- Blog post summary in the student feed
- `StudentWelcome` -- Greeting data with streak and group count
- `AdminDashboardData` -- Aggregated dashboard data for admins
- `TeacherDashboardData` -- Aggregated dashboard data for teachers
- `StudentDashboardData` -- Aggregated dashboard data for students

### Attendance
- `AttendanceGroup` -- Group with today's attendance rate and submission status
- `RosterStudent` -- Student row in the attendance checklist
- `StudentReport` -- Per-student attendance statistics
- `StudentHistoryRecord` -- Single attendance record in student's history
- `StudentSummary` -- Student's personal attendance overview
- `GroupDetail` -- Group detail with roster and report data

### Blog
- `BlogCategory` -- Post category with article count
- `ReactionSummary` -- Emoji reaction aggregate per post
- `Author` -- Author profile attached to posts and comments
- `PostPreview` -- Post card shown in the blog feed
- `PostDetail` -- Full post with rich text content
- `GifAttachment` -- GIPHY GIF embedded in comments
- `Comment` -- Top-level comment with nested replies
- `CommentReply` -- First-level reply to a comment
- `SubReply` -- Second-level reply (deepest threading level)
- `Draft` -- Student-submitted draft awaiting approval

### Teaching Tools
- `ToolCategory` -- Tool grouping with sort order
- `Tool` -- Individual teaching utility with icon and color
- `Favorite` -- User-tool favorite association

### AI Transcription
- `Folder` -- Organizational folder for recordings
- `Recording` -- Audio recording with metadata and transcription status
- `TranscriptionResult` -- AI-generated transcript, summary, and action items
- `RecordingDetail` -- Recording with its transcription data
- `RecorderData` -- Live recorder state (elapsed time, volume, etc.)

## Implementation Sequence

| Milestone | Target                 | Dependency       |
|-----------|------------------------|------------------|
| 1         | Shell (navigation, layout, i18n, dark mode) | None |
| 2         | Dashboard              | Shell            |
| 3         | Attendance             | Shell            |
| 4         | People                 | Shell            |
| 5         | Blog                   | Shell            |
| 6         | Teaching Tools         | Shell            |
| 7         | AI Transcription       | Shell            |

Each section depends only on the Shell. Sections 2-7 can be built in parallel after the Shell is complete, but the recommended order follows the table above.

## Technical Notes

- **i18n:** react-i18next with namespaced JSON locale files. Adding a language = adding a folder.
- **Responsive:** Mobile-first with Tailwind responsive prefixes (sm, md, lg, xl).
- **Dark mode:** `dark:` variant classes throughout. Toggle in header and user menu.
- **Components:** Props-based, no direct data imports. Ready for any state management approach.
- **Tailwind CSS v4:** No tailwind.config.js. Uses built-in utilities and color palettes.
