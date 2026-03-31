// =============================================================================
// CEICAVS — UI Data Shapes
//
// These TypeScript interfaces define the data contracts between your API layer
// and the React components. They describe what the UI expects, not how data
// is stored in the database.
// =============================================================================

// =============================================================================
// Shared / People
// =============================================================================

/** Predefined platform roles — always lowercase across the system */
export type UserRole = 'admin' | 'teacher' | 'student'

export interface Role {
  id: string
  name: UserRole
  description: string
  userCount: number
}

export interface Permission {
  id: string
  key: string
  label: string
  /** Role IDs that have this permission */
  roles: string[]
}

export interface GroupSummary {
  id: string
  name: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  roleId: string
  groups: GroupSummary[]
  createdAt: string
}

export interface Group {
  id: string
  name: string
  description: string
  memberCount: number
  createdBy: string
  createdAt: string
}

// =============================================================================
// Dashboard
// =============================================================================

/** A single summary statistic displayed as a card */
export interface StatCard {
  id: string
  label: string
  value: string | number
  /** Optional trend: positive = up arrow, negative = down arrow */
  trend?: {
    direction: 'up' | 'down'
    percentage: number
  }
  icon?: string
}

/** A single item in the activity feed */
export interface ActivityItem {
  id: string
  type: 'attendance' | 'post_published' | 'draft_submitted' | 'user_registered' | 'recording_created'
  description: string
  actorName: string
  actorRole: UserRole
  timestamp: string
}

/** A quick action shortcut button */
export interface QuickAction {
  id: string
  label: string
  href: string
  icon: string
}

/** A student's blog draft with its current status */
export interface DraftStatus {
  id: string
  title: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
}

/** A recent blog post shown in the student feed */
export interface RecentPost {
  id: string
  title: string
  authorName: string
  publishedAt: string
  categoryName: string
}

/** Student welcome/motivational data */
export interface StudentWelcome {
  studentName: string
  attendanceStreak: number
  groupCount: number
}

/** Dashboard data scoped to the Admin role */
export interface AdminDashboardData {
  stats: StatCard[]
  activityFeed: ActivityItem[]
  quickActions: QuickAction[]
}

/** Dashboard data scoped to the Teacher role */
export interface TeacherDashboardData {
  stats: StatCard[]
  activityFeed: ActivityItem[]
  quickActions: QuickAction[]
}

/** Dashboard data scoped to the Student role */
export interface StudentDashboardData {
  welcome: StudentWelcome
  stats: StatCard[]
  recentPosts: RecentPost[]
  draftStatuses: DraftStatus[]
  quickActions: QuickAction[]
}

// =============================================================================
// Attendance
// =============================================================================

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type ReportPeriod = 'daily' | 'weekly' | 'monthly'
export type ExportFormat = 'pdf' | 'excel'

/** A group shown in the groups list */
export interface AttendanceGroup {
  id: string
  name: string
  memberCount: number
  /** Today's attendance rate as a percentage (0-100) */
  todayRate: number | null
  /** Whether attendance has been submitted today */
  todaySubmitted: boolean
}

/** A student in the roster checklist */
export interface RosterStudent {
  id: string
  name: string
  avatarUrl?: string
  /** Current status for today — null if not yet marked */
  status: AttendanceStatus | null
}

/** Per-student row in the reports table */
export interface StudentReport {
  studentId: string
  studentName: string
  attendanceRate: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
  totalDays: number
}

/** A single attendance record in the student's personal history */
export interface StudentHistoryRecord {
  id: string
  date: string
  groupName: string
  status: AttendanceStatus
}

/** Student personal attendance summary */
export interface StudentSummary {
  overallRate: number
  currentStreak: number
  groupCount: number
}

/** Group detail data including roster and reports */
export interface GroupDetail {
  group: AttendanceGroup
  date: string
  roster: RosterStudent[]
  reports: StudentReport[]
}

// =============================================================================
// Blog
// =============================================================================

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

// =============================================================================
// Teaching Tools
// =============================================================================

export type ToolColor =
  | 'lime'
  | 'amber'
  | 'red'
  | 'sky'
  | 'rose'
  | 'violet'
  | 'emerald'
  | 'orange'
  | 'stone'
  | 'cyan'
  | 'yellow'
  | 'indigo'
  | 'teal'
  | 'fuchsia'

export interface ToolCategory {
  id: string
  name: string
  slug: string
  order: number
}

export interface Tool {
  id: string
  name: string
  description: string
  categoryId: string
  icon: string
  color: ToolColor
}

export interface Favorite {
  userId: string
  toolId: string
}

// =============================================================================
// AI Transcription
// =============================================================================

export type TranscriptionStatus = 'none' | 'processing' | 'completed'
export type RecorderState = 'idle' | 'recording' | 'paused'

/** A folder for organizing recordings */
export interface Folder {
  id: string
  name: string
  recordingCount: number
}

/** A recording card shown in the list */
export interface Recording {
  id: string
  userId: string
  name: string
  folderId: string
  folderName: string
  /** Duration in seconds */
  duration: number
  createdAt: string
  transcriptionStatus: TranscriptionStatus
  /** Audio file URL for playback */
  audioUrl?: string
}

/** AI-generated transcription results */
export interface TranscriptionResult {
  /** Complete transcript text */
  fullTranscript: string
  /** Executive summary */
  summary: string
  /** Bulleted list of key points */
  keyTakeaways: string[]
  /** Detected action items / tasks */
  actionItems: string[]
  /** When the transcription was completed */
  completedAt: string
}

/** Full recording detail including transcription */
export interface RecordingDetail {
  recording: Recording
  transcription?: TranscriptionResult
}

/** Recorder state data */
export interface RecorderData {
  state: RecorderState
  /** Elapsed time in seconds */
  elapsedSeconds: number
  /** Max duration in seconds (1800 = 30 min) */
  maxSeconds: number
  /** Volume level 0-100 */
  volumeLevel: number
}
