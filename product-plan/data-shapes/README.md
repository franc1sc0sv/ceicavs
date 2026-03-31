# Data Shapes

This directory contains TypeScript interfaces that define the **UI data contracts** for the CEICAVS platform. These are the shapes that frontend components expect to receive via props.

## Important Distinction

These are **frontend data shapes**, not database schemas. They describe what the UI needs to render, not how data is stored. Your backend can structure its database however it wants -- these interfaces define the contract between your API layer and your React components.

For example, a `PostPreview` contains an embedded `Author` object and an array of `ReactionSummary` items. Your API might join across multiple database tables to produce this shape, but the component only cares about the final structure it receives.

## Entity Overview

### Shared / People
- `UserRole` -- Union type: admin, teacher, student
- `Role` -- Named role with description and user count
- `Permission` -- Granular permission key assigned to roles
- `GroupSummary` -- Lightweight group reference (id + name)
- `User` -- Full user profile with role and group memberships
- `Group` -- Group record with description and member count

### Dashboard
- `StatCard` -- Summary statistic with optional trend indicator
- `ActivityItem` -- Activity feed entry
- `QuickAction` -- Shortcut button to a section or action
- `DraftStatus` -- Student blog draft with approval status
- `RecentPost` -- Blog post summary for the student feed
- `StudentWelcome` -- Greeting data (streak, group count)
- `AdminDashboardData` -- Aggregated admin dashboard
- `TeacherDashboardData` -- Aggregated teacher dashboard
- `StudentDashboardData` -- Aggregated student dashboard

### Attendance
- `AttendanceStatus` -- Union type: present, absent, late, excused
- `ReportPeriod` -- Union type: daily, weekly, monthly
- `ExportFormat` -- Union type: pdf, excel
- `AttendanceGroup` -- Group with today's rate and submission status
- `RosterStudent` -- Student row in the attendance checklist
- `StudentReport` -- Per-student attendance statistics
- `StudentHistoryRecord` -- Single attendance record in history
- `StudentSummary` -- Personal attendance overview
- `GroupDetail` -- Group detail with roster and reports

### Blog
- `PostStatus` -- Union type: published, draft, rejected
- `EmojiType` -- Union type: like, love, insightful, funny, celebrate
- `DraftAction` -- Union type: approve, reject
- `BlogCategory` -- Category with post count
- `ReactionSummary` -- Emoji reaction aggregate
- `Author` -- Author profile for posts and comments
- `PostPreview` -- Post card for the feed
- `PostDetail` -- Full post with rich text content
- `GifAttachment` -- GIPHY GIF for comments
- `Comment` -- Top-level comment with replies
- `CommentReply` -- First-level reply
- `SubReply` -- Second-level reply (max depth)
- `Draft` -- Student draft awaiting approval

### Teaching Tools
- `ToolColor` -- Union type of allowed tool badge colors
- `ToolCategory` -- Tool grouping with sort order
- `Tool` -- Teaching utility with icon and color
- `Favorite` -- User-tool favorite link

### AI Transcription
- `TranscriptionStatus` -- Union type: none, processing, completed
- `RecorderState` -- Union type: idle, recording, paused
- `Folder` -- Organizational folder for recordings
- `Recording` -- Audio recording with metadata
- `TranscriptionResult` -- AI transcript, summary, and action items
- `RecordingDetail` -- Recording with transcription data
- `RecorderData` -- Live recorder state

## Files

- `overview.ts` -- All entity interfaces combined in one file, grouped by section.
