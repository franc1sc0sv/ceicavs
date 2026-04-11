/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type ActivityItemType = {
  __typename?: 'ActivityItemType';
  actorAvatarUrl: Maybe<Scalars['String']['output']>;
  actorName: Scalars['String']['output'];
  actorRole: UserRole;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  entityId: Maybe<Scalars['String']['output']>;
  entityType: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  type: Scalars['String']['output'];
};

export type AddCommentInput = {
  gifAlt: InputMaybe<Scalars['String']['input']>;
  gifUrl: InputMaybe<Scalars['String']['input']>;
  parentId: InputMaybe<Scalars['ID']['input']>;
  postId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
};

export type AdminDashboardStatsType = {
  __typename?: 'AdminDashboardStatsType';
  attendanceTrend: Array<AttendanceDayPointType>;
  globalAttendanceRateLastWeek: Scalars['Float']['output'];
  globalAttendanceRateThisWeek: Scalars['Float']['output'];
  postsByStatus: DashboardPostsByStatusType;
  publishedPostsLastMonth: Scalars['Int']['output'];
  publishedPostsThisMonth: Scalars['Int']['output'];
  totalGroups: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
  usersByRole: DashboardUsersByRoleType;
};

export type AttendanceDayPointType = {
  __typename?: 'AttendanceDayPointType';
  date: Scalars['String']['output'];
  rate: Scalars['Float']['output'];
};

export type AttendanceGroupLineType = {
  __typename?: 'AttendanceGroupLineType';
  groupId: Scalars['ID']['output'];
  groupName: Scalars['String']['output'];
  points: Array<AttendanceDayPointType>;
};

export type AttendanceGroupType = {
  __typename?: 'AttendanceGroupType';
  id: Scalars['ID']['output'];
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  todayRate: Maybe<Scalars['Float']['output']>;
  todaySubmitted: Scalars['Boolean']['output'];
};

export type AttendanceRecordItemInput = {
  status: AttendanceStatus;
  studentId: Scalars['String']['input'];
};

export type AttendanceStatus =
  | 'absent'
  | 'excused'
  | 'late'
  | 'present';

export type AuthTokensType = {
  __typename?: 'AuthTokensType';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type AuthorType = {
  __typename?: 'AuthorType';
  avatarUrl: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
};

export type BulkDeleteUsersInput = {
  ids: Array<Scalars['String']['input']>;
};

export type BulkUpdateUsersInput = {
  ids: Array<Scalars['String']['input']>;
  role: UserRole;
};

export type CategoryType = {
  __typename?: 'CategoryType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CommentType = {
  __typename?: 'CommentType';
  author: AuthorType;
  createdAt: Scalars['DateTime']['output'];
  depth: Scalars['Int']['output'];
  gifAlt: Maybe<Scalars['String']['output']>;
  gifUrl: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  parentId: Maybe<Scalars['ID']['output']>;
  postId: Scalars['ID']['output'];
  reactionSummary: Array<ReactionSummaryType>;
  replyCount: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CommentsPageType = {
  __typename?: 'CommentsPageType';
  items: Array<CommentType>;
  nextCursor: Maybe<Scalars['String']['output']>;
};

export type CreateGroupInput = {
  description: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateNoteInput = {
  content: Scalars['String']['input'];
};

export type CreatePostInput = {
  categoryIds: Array<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  excerpt: Scalars['String']['input'];
  images: InputMaybe<Array<PostImageInput>>;
  publish: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type CreateRecordingInput = {
  audioUrl: Scalars['String']['input'];
  cloudinaryPublicId: Scalars['String']['input'];
  duration: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type CreateTaskItemInput = {
  text: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRole;
};

export type DashboardPostsByStatusType = {
  __typename?: 'DashboardPostsByStatusType';
  draft: Scalars['Int']['output'];
  published: Scalars['Int']['output'];
  rejected: Scalars['Int']['output'];
};

export type DashboardUsersByRoleType = {
  __typename?: 'DashboardUsersByRoleType';
  admin: Scalars['Int']['output'];
  student: Scalars['Int']['output'];
  teacher: Scalars['Int']['output'];
};

export type DeleteNoteInput = {
  id: Scalars['ID']['input'];
};

export type DeleteRecordingInput = {
  id: Scalars['ID']['input'];
};

export type DeleteTaskItemInput = {
  id: Scalars['ID']['input'];
};

export type ExportAttendanceInput = {
  format: ExportFormat;
  groupId: Scalars['String']['input'];
  period: ReportPeriod;
};

export type ExportFormat =
  | 'EXCEL'
  | 'PDF';

export type ExportJobStatus =
  | 'DONE'
  | 'FAILED'
  | 'PENDING'
  | 'PROCESSING';

export type ExportJobType = {
  __typename?: 'ExportJobType';
  jobId: Scalars['ID']['output'];
};

export type ExportStatusType = {
  __typename?: 'ExportStatusType';
  downloadUrl: Maybe<Scalars['String']['output']>;
  jobId: Scalars['ID']['output'];
  status: ExportJobStatus;
};

export type GenerateSummaryInput = {
  prompt: InputMaybe<Scalars['String']['input']>;
  recordingId: Scalars['ID']['input'];
};

export type GetRecordingInput = {
  id: Scalars['ID']['input'];
};

export type GroupFiltersInput = {
  search: InputMaybe<Scalars['String']['input']>;
};

export type GroupMemberType = {
  __typename?: 'GroupMemberType';
  avatarUrl: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  joinedAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
};

export type GroupRosterType = {
  __typename?: 'GroupRosterType';
  date: Scalars['String']['output'];
  group: AttendanceGroupType;
  roster: Array<RosterStudentType>;
};

export type GroupType = {
  __typename?: 'GroupType';
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GroupWithMembersType = {
  __typename?: 'GroupWithMembersType';
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  memberCount: Scalars['Int']['output'];
  members: Array<GroupMemberType>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ImportUserRowInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  role: UserRole;
};

export type ImportUsersInput = {
  rows: Array<ImportUserRowInput>;
};

export type ImportUsersResultType = {
  __typename?: 'ImportUsersResultType';
  created: Scalars['Int']['output'];
  errors: Array<Scalars['String']['output']>;
  skipped: Scalars['Int']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addComment: CommentType;
  addMemberToGroup: Scalars['Boolean']['output'];
  bulkDeleteUsers: Scalars['Boolean']['output'];
  bulkUpdateUsers: Scalars['Boolean']['output'];
  createCategory: CategoryType;
  createGroup: GroupType;
  createNote: NoteType;
  createPost: PostType;
  createRecording: RecordingType;
  createTaskItem: TaskItemType;
  createUser: UserType;
  deleteCategory: Scalars['Boolean']['output'];
  deleteComment: Scalars['Boolean']['output'];
  deleteGroup: Scalars['Boolean']['output'];
  deleteNote: Scalars['Boolean']['output'];
  deletePost: Scalars['Boolean']['output'];
  deleteRecording: Scalars['Boolean']['output'];
  deleteTaskItem: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  exportAttendance: ExportJobType;
  generateSummary: Scalars['Boolean']['output'];
  importUsers: ImportUsersResultType;
  login: AuthTokensType;
  recordAttendance: Scalars['Boolean']['output'];
  refreshToken: AuthTokensType;
  removeMemberFromGroup: Scalars['Boolean']['output'];
  reorderTaskItems: Scalars['Boolean']['output'];
  reviewDraft: PostType;
  toggleReaction: Array<ReactionSummaryType>;
  updateCategory: CategoryType;
  updateComment: CommentType;
  updateGroup: GroupType;
  updateNote: NoteType;
  updatePost: PostType;
  updateSummaryPrompt: Scalars['Boolean']['output'];
  updateTaskItem: TaskItemType;
  updateTranscription: Scalars['Boolean']['output'];
  updateUser: UserType;
};


export type MutationAddCommentArgs = {
  input: AddCommentInput;
};


export type MutationAddMemberToGroupArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationBulkDeleteUsersArgs = {
  input: BulkDeleteUsersInput;
};


export type MutationBulkUpdateUsersArgs = {
  input: BulkUpdateUsersInput;
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateRecordingArgs = {
  input: CreateRecordingInput;
};


export type MutationCreateTaskItemArgs = {
  input: CreateTaskItemInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGroupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNoteArgs = {
  input: DeleteNoteInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRecordingArgs = {
  input: DeleteRecordingInput;
};


export type MutationDeleteTaskItemArgs = {
  input: DeleteTaskItemInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationExportAttendanceArgs = {
  input: ExportAttendanceInput;
};


export type MutationGenerateSummaryArgs = {
  input: GenerateSummaryInput;
};


export type MutationImportUsersArgs = {
  input: ImportUsersInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRecordAttendanceArgs = {
  input: RecordAttendanceInput;
};


export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput;
};


export type MutationRemoveMemberFromGroupArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationReorderTaskItemsArgs = {
  input: ReorderTaskItemsInput;
};


export type MutationReviewDraftArgs = {
  id: Scalars['ID']['input'];
  input: ReviewDraftInput;
};


export type MutationToggleReactionArgs = {
  commentId: InputMaybe<Scalars['ID']['input']>;
  emoji: InputMaybe<Scalars['String']['input']>;
  postId: InputMaybe<Scalars['ID']['input']>;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateCommentArgs = {
  id: Scalars['ID']['input'];
  text: Scalars['String']['input'];
};


export type MutationUpdateGroupArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGroupInput;
};


export type MutationUpdateNoteArgs = {
  input: UpdateNoteInput;
};


export type MutationUpdatePostArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePostInput;
};


export type MutationUpdateSummaryPromptArgs = {
  input: UpdateSummaryPromptInput;
};


export type MutationUpdateTaskItemArgs = {
  input: UpdateTaskItemInput;
};


export type MutationUpdateTranscriptionArgs = {
  input: UpdateTranscriptionInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};

export type NoteType = {
  __typename?: 'NoteType';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PostFiltersInput = {
  authorId: InputMaybe<Scalars['ID']['input']>;
  categoryId: InputMaybe<Scalars['ID']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<PostStatus>;
};

export type PostImageInput = {
  order: Scalars['Int']['input'];
  publicId: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type PostImageType = {
  __typename?: 'PostImageType';
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  publicId: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type PostStatus =
  | 'draft'
  | 'published'
  | 'rejected';

export type PostType = {
  __typename?: 'PostType';
  author: AuthorType;
  authorId: Scalars['ID']['output'];
  categories: Array<CategoryType>;
  commentCount: Scalars['Int']['output'];
  comments: Maybe<Array<CommentType>>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  excerpt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  images: Maybe<Array<PostImageType>>;
  publishedAt: Maybe<Scalars['DateTime']['output']>;
  reactionSummary: Array<ReactionSummaryType>;
  rejectionNote: Maybe<Scalars['String']['output']>;
  status: PostStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PostsPageType = {
  __typename?: 'PostsPageType';
  items: Array<PostType>;
  nextCursor: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  adminDashboard: AdminDashboardStatsType;
  attendanceExportStatus: ExportStatusType;
  attendanceGroups: Array<AttendanceGroupType>;
  attendanceReport: Array<StudentReportType>;
  attendanceRoster: GroupRosterType;
  categories: Array<CategoryType>;
  comments: CommentsPageType;
  draftQueue: Array<PostType>;
  feed: PostsPageType;
  getGroup: Maybe<GroupWithMembersType>;
  getGroups: Array<GroupType>;
  getRecording: RecordingType;
  getRecordings: Array<RecordingType>;
  getSummaryPrompt: Scalars['String']['output'];
  getUser: Maybe<UserType>;
  getUsers: Array<UserType>;
  me: UserProfileType;
  myDrafts: Array<PostType>;
  notes: Array<NoteType>;
  post: PostType;
  posts: Array<PostType>;
  recentActivity: Array<ActivityItemType>;
  replies: CommentsPageType;
  studentAttendanceHistory: Array<StudentHistoryRecordType>;
  studentAttendanceSummary: StudentSummaryType;
  studentDashboard: StudentDashboardStatsType;
  taskItems: Array<TaskItemType>;
  teacherDashboard: TeacherDashboardStatsType;
  tools: Array<ToolType>;
};


export type QueryAttendanceExportStatusArgs = {
  jobId: Scalars['String']['input'];
};


export type QueryAttendanceReportArgs = {
  groupId: Scalars['String']['input'];
  period: ReportPeriod;
};


export type QueryAttendanceRosterArgs = {
  date: Scalars['String']['input'];
  groupId: Scalars['String']['input'];
};


export type QueryCommentsArgs = {
  cursor: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  postId: Scalars['ID']['input'];
};


export type QueryFeedArgs = {
  cursor: InputMaybe<Scalars['String']['input']>;
  filters: InputMaybe<PostFiltersInput>;
  limit: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetGroupsArgs = {
  filters: InputMaybe<GroupFiltersInput>;
};


export type QueryGetRecordingArgs = {
  input: GetRecordingInput;
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUsersArgs = {
  filters: InputMaybe<UserFiltersInput>;
};


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostsArgs = {
  filters: InputMaybe<PostFiltersInput>;
};


export type QueryRecentActivityArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRepliesArgs = {
  cursor: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  parentId: Scalars['ID']['input'];
};

export type ReactionSummaryType = {
  __typename?: 'ReactionSummaryType';
  count: Scalars['Int']['output'];
  emoji: Scalars['String']['output'];
  userReacted: Scalars['Boolean']['output'];
};

export type RecordAttendanceInput = {
  date: Scalars['String']['input'];
  groupId: Scalars['String']['input'];
  records: Array<AttendanceRecordItemInput>;
};

export type RecordingType = {
  __typename?: 'RecordingType';
  audioUrl: Maybe<Scalars['String']['output']>;
  cloudinaryPublicId: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  duration: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  transcription: Maybe<TranscriptionType>;
  transcriptionStatus: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RefreshTokenInput = {
  refreshToken: Scalars['String']['input'];
};

export type ReorderItemInput = {
  id: Scalars['ID']['input'];
  order: Scalars['Int']['input'];
};

export type ReorderTaskItemsInput = {
  items: Array<ReorderItemInput>;
};

export type ReportPeriod =
  | 'DAILY'
  | 'MONTHLY'
  | 'WEEKLY';

export type ReviewDraftInput = {
  action: Scalars['String']['input'];
  rejectionNote: InputMaybe<Scalars['String']['input']>;
};

export type RosterStudentType = {
  __typename?: 'RosterStudentType';
  avatarUrl: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  status: Maybe<AttendanceStatus>;
};

export type StudentAttendanceDayPointType = {
  __typename?: 'StudentAttendanceDayPointType';
  date: Scalars['String']['output'];
  status: Maybe<Scalars['String']['output']>;
};

export type StudentDashboardStatsType = {
  __typename?: 'StudentDashboardStatsType';
  myAttendanceRate: Scalars['Float']['output'];
  myAttendanceTrend: Array<StudentAttendanceDayPointType>;
  myCurrentStreak: Scalars['Int']['output'];
  myDraftCount: Scalars['Int']['output'];
  myGroupMembershipCount: Scalars['Int']['output'];
};

export type StudentHistoryRecordType = {
  __typename?: 'StudentHistoryRecordType';
  date: Scalars['String']['output'];
  groupName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  status: AttendanceStatus;
};

export type StudentReportType = {
  __typename?: 'StudentReportType';
  absentCount: Scalars['Int']['output'];
  attendanceRate: Scalars['Float']['output'];
  excusedCount: Scalars['Int']['output'];
  lateCount: Scalars['Int']['output'];
  presentCount: Scalars['Int']['output'];
  studentId: Scalars['ID']['output'];
  studentName: Scalars['String']['output'];
  totalDays: Scalars['Int']['output'];
};

export type StudentSummaryType = {
  __typename?: 'StudentSummaryType';
  currentStreak: Scalars['Int']['output'];
  groupCount: Scalars['Int']['output'];
  overallRate: Scalars['Float']['output'];
};

export type TaskItemType = {
  __typename?: 'TaskItemType';
  completed: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TeacherDashboardStatsType = {
  __typename?: 'TeacherDashboardStatsType';
  myGroupAttendanceTrend: Array<AttendanceGroupLineType>;
  myGroupCount: Scalars['Int']['output'];
  myGroupsTodayRate: Scalars['Float']['output'];
  myPostCount: Scalars['Int']['output'];
  myPostsByStatus: DashboardPostsByStatusType;
  pendingAttendanceCount: Scalars['Int']['output'];
};

export type ToolCategoryType = {
  __typename?: 'ToolCategoryType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
};

export type ToolType = {
  __typename?: 'ToolType';
  category: ToolCategoryType;
  color: Scalars['String']['output'];
  description: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

export type TranscriptionType = {
  __typename?: 'TranscriptionType';
  actionItems: Array<Scalars['String']['output']>;
  completedAt: Maybe<Scalars['DateTime']['output']>;
  fullTranscript: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  keyTakeaways: Array<Scalars['String']['output']>;
  segments: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  summary: Maybe<Scalars['String']['output']>;
  summaryError: Maybe<Scalars['String']['output']>;
  summaryStatus: Scalars['String']['output'];
};

export type UpdateGroupInput = {
  description: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNoteInput = {
  content: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type UpdatePostInput = {
  categoryIds: InputMaybe<Array<Scalars['String']['input']>>;
  content: InputMaybe<Scalars['String']['input']>;
  excerpt: InputMaybe<Scalars['String']['input']>;
  images: InputMaybe<Array<PostImageInput>>;
  title: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSummaryPromptInput = {
  prompt: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTaskItemInput = {
  completed: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  text: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTranscriptionInput = {
  fullTranscript: Scalars['String']['input'];
  recordingId: Scalars['String']['input'];
  segments: Scalars['String']['input'];
  summary: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  email: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  role: InputMaybe<UserRole>;
};

export type UserFiltersInput = {
  groupId: InputMaybe<Scalars['String']['input']>;
  isDeactivated: InputMaybe<Scalars['Boolean']['input']>;
  role: InputMaybe<UserRole>;
  search: InputMaybe<Scalars['String']['input']>;
};

export type UserGroupType = {
  __typename?: 'UserGroupType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type UserProfileType = {
  __typename?: 'UserProfileType';
  avatarUrl: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
};

export type UserRole =
  | 'admin'
  | 'student'
  | 'teacher';

export type UserType = {
  __typename?: 'UserType';
  avatarUrl: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  groups: Maybe<Array<UserGroupType>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
};

export type RecordAttendanceMutationVariables = Exact<{
  input: RecordAttendanceInput;
}>;


export type RecordAttendanceMutation = { __typename?: 'Mutation', recordAttendance: boolean };

export type ExportAttendanceMutationVariables = Exact<{
  input: ExportAttendanceInput;
}>;


export type ExportAttendanceMutation = { __typename?: 'Mutation', exportAttendance: { __typename?: 'ExportJobType', jobId: string } };

export type GetAttendanceGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAttendanceGroupsQuery = { __typename?: 'Query', attendanceGroups: Array<{ __typename?: 'AttendanceGroupType', id: string, name: string, memberCount: number, todayRate: number | null, todaySubmitted: boolean }> };

export type GetAttendanceRosterQueryVariables = Exact<{
  groupId: Scalars['String']['input'];
  date: Scalars['String']['input'];
}>;


export type GetAttendanceRosterQuery = { __typename?: 'Query', attendanceRoster: { __typename?: 'GroupRosterType', date: string, group: { __typename?: 'AttendanceGroupType', id: string, name: string, memberCount: number, todayRate: number | null, todaySubmitted: boolean }, roster: Array<{ __typename?: 'RosterStudentType', id: string, name: string, avatarUrl: string | null, status: AttendanceStatus | null }> } };

export type GetAttendanceReportQueryVariables = Exact<{
  groupId: Scalars['String']['input'];
  period: ReportPeriod;
}>;


export type GetAttendanceReportQuery = { __typename?: 'Query', attendanceReport: Array<{ __typename?: 'StudentReportType', studentId: string, studentName: string, attendanceRate: number, presentCount: number, absentCount: number, lateCount: number, excusedCount: number, totalDays: number }> };

export type GetStudentAttendanceHistoryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStudentAttendanceHistoryQuery = { __typename?: 'Query', studentAttendanceHistory: Array<{ __typename?: 'StudentHistoryRecordType', id: string, date: string, groupName: string, status: AttendanceStatus }> };

export type GetStudentAttendanceSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStudentAttendanceSummaryQuery = { __typename?: 'Query', studentAttendanceSummary: { __typename?: 'StudentSummaryType', overallRate: number, currentStreak: number, groupCount: number } };

export type GetExportStatusQueryVariables = Exact<{
  jobId: Scalars['String']['input'];
}>;


export type GetExportStatusQuery = { __typename?: 'Query', attendanceExportStatus: { __typename?: 'ExportStatusType', jobId: string, status: ExportJobStatus, downloadUrl: string | null } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthTokensType', accessToken: string, refreshToken: string } };

export type RefreshTokenMutationVariables = Exact<{
  input: RefreshTokenInput;
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthTokensType', accessToken: string, refreshToken: string } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserProfileType', id: string, email: string, name: string, role: UserRole, avatarUrl: string | null } };

export type CreatePostMutationVariables = Exact<{
  input: CreatePostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'PostType', id: string, status: PostStatus } };

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdatePostInput;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost: { __typename?: 'PostType', id: string } };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type ReviewDraftMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: ReviewDraftInput;
}>;


export type ReviewDraftMutation = { __typename?: 'Mutation', reviewDraft: { __typename?: 'PostType', id: string, status: PostStatus } };

export type ToggleReactionMutationVariables = Exact<{
  postId: InputMaybe<Scalars['ID']['input']>;
  commentId: InputMaybe<Scalars['ID']['input']>;
  emoji: InputMaybe<Scalars['String']['input']>;
}>;


export type ToggleReactionMutation = { __typename?: 'Mutation', toggleReaction: Array<{ __typename?: 'ReactionSummaryType', emoji: string, count: number, userReacted: boolean }> };

export type AddCommentMutationVariables = Exact<{
  input: AddCommentInput;
}>;


export type AddCommentMutation = { __typename?: 'Mutation', addComment: { __typename?: 'CommentType', id: string, text: string, parentId: string | null, depth: number, gifUrl: string | null, gifAlt: string | null, createdAt: any, author: { __typename?: 'AuthorType', id: string, name: string, avatarUrl: string | null, role: UserRole } } };

export type UpdateCommentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  text: Scalars['String']['input'];
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: { __typename?: 'CommentType', id: string, text: string } };

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: boolean };

export type CreateCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'CategoryType', id: string, name: string } };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'CategoryType', id: string, name: string } };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: boolean };

export type GetPostsQueryVariables = Exact<{
  filters: InputMaybe<PostFiltersInput>;
}>;


export type GetPostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'PostType', id: string, title: string, excerpt: string, status: PostStatus, createdAt: any, commentCount: number, author: { __typename?: 'AuthorType', id: string, name: string, avatarUrl: string | null, role: UserRole }, categories: Array<{ __typename?: 'CategoryType', id: string, name: string }>, reactionSummary: Array<{ __typename?: 'ReactionSummaryType', emoji: string, count: number, userReacted: boolean }> }> };

export type GetPostByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPostByIdQuery = { __typename?: 'Query', post: { __typename?: 'PostType', id: string, title: string, excerpt: string, content: string, status: PostStatus, createdAt: any, updatedAt: any, rejectionNote: string | null, publishedAt: any | null, author: { __typename?: 'AuthorType', id: string, name: string, avatarUrl: string | null, role: UserRole }, categories: Array<{ __typename?: 'CategoryType', id: string, name: string }>, reactionSummary: Array<{ __typename?: 'ReactionSummaryType', emoji: string, count: number, userReacted: boolean }>, images: Array<{ __typename?: 'PostImageType', id: string, url: string, publicId: string, order: number }> | null } };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'CategoryType', id: string, name: string }> };

export type GetDraftQueueQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDraftQueueQuery = { __typename?: 'Query', draftQueue: Array<{ __typename?: 'PostType', id: string, title: string, excerpt: string, createdAt: any, author: { __typename?: 'AuthorType', id: string, name: string, avatarUrl: string | null }, categories: Array<{ __typename?: 'CategoryType', id: string, name: string }> }> };

export type GetMyDraftsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyDraftsQuery = { __typename?: 'Query', myDrafts: Array<{ __typename?: 'PostType', id: string, title: string, status: PostStatus, rejectionNote: string | null, createdAt: any, updatedAt: any, categories: Array<{ __typename?: 'CategoryType', id: string, name: string }> }> };

export type GetFeedQueryVariables = Exact<{
  filters: InputMaybe<PostFiltersInput>;
  cursor: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFeedQuery = { __typename?: 'Query', feed: { __typename?: 'PostsPageType', nextCursor: string | null, items: Array<{ __typename?: 'PostType', id: string, title: string, excerpt: string, status: PostStatus, createdAt: any, publishedAt: any | null, authorId: string, commentCount: number, author: { __typename?: 'AuthorType', id: string, name: string, avatarUrl: string | null, role: UserRole }, categories: Array<{ __typename?: 'CategoryType', id: string, name: string }>, reactionSummary: Array<{ __typename?: 'ReactionSummaryType', emoji: string, count: number, userReacted: boolean }>, images: Array<{ __typename?: 'PostImageType', id: string, url: string, publicId: string, order: number }> | null }> } };

export type GetCommentsQueryVariables = Exact<{
  postId: Scalars['ID']['input'];
  cursor: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCommentsQuery = { __typename?: 'Query', comments: { __typename?: 'CommentsPageType', nextCursor: string | null, items: Array<{ __typename?: 'CommentType', id: string, text: string, parentId: string | null, postId: string, depth: number, gifUrl: string | null, gifAlt: string | null, replyCount: number | null, createdAt: any, updatedAt: any, reactionSummary: Array<{ __typename?: 'ReactionSummaryType', emoji: string, count: number, userReacted: boolean }>, author: { __typename?: 'AuthorType', id: string, name: string, avatarUrl: string | null, role: UserRole } }> } };

export type GetRepliesQueryVariables = Exact<{
  parentId: Scalars['ID']['input'];
  cursor: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRepliesQuery = { __typename?: 'Query', replies: { __typename?: 'CommentsPageType', nextCursor: string | null, items: Array<{ __typename?: 'CommentType', id: string, text: string, parentId: string | null, postId: string, depth: number, gifUrl: string | null, gifAlt: string | null, replyCount: number | null, createdAt: any, updatedAt: any, reactionSummary: Array<{ __typename?: 'ReactionSummaryType', emoji: string, count: number, userReacted: boolean }>, author: { __typename?: 'AuthorType', id: string, name: string, avatarUrl: string | null, role: UserRole } }> } };

export type GetAdminDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminDashboardQuery = { __typename?: 'Query', adminDashboard: { __typename?: 'AdminDashboardStatsType', totalUsers: number, totalGroups: number, publishedPostsThisMonth: number, publishedPostsLastMonth: number, globalAttendanceRateThisWeek: number, globalAttendanceRateLastWeek: number, usersByRole: { __typename?: 'DashboardUsersByRoleType', admin: number, teacher: number, student: number }, postsByStatus: { __typename?: 'DashboardPostsByStatusType', published: number, draft: number, rejected: number }, attendanceTrend: Array<{ __typename?: 'AttendanceDayPointType', date: string, rate: number }> } };

export type GetTeacherDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTeacherDashboardQuery = { __typename?: 'Query', teacherDashboard: { __typename?: 'TeacherDashboardStatsType', myGroupCount: number, myGroupsTodayRate: number, myPostCount: number, pendingAttendanceCount: number, myGroupAttendanceTrend: Array<{ __typename?: 'AttendanceGroupLineType', groupId: string, groupName: string, points: Array<{ __typename?: 'AttendanceDayPointType', date: string, rate: number }> }>, myPostsByStatus: { __typename?: 'DashboardPostsByStatusType', published: number, draft: number, rejected: number } } };

export type GetStudentDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStudentDashboardQuery = { __typename?: 'Query', studentDashboard: { __typename?: 'StudentDashboardStatsType', myAttendanceRate: number, myCurrentStreak: number, myDraftCount: number, myGroupMembershipCount: number, myAttendanceTrend: Array<{ __typename?: 'StudentAttendanceDayPointType', date: string, status: string | null }> } };

export type GetRecentActivityQueryVariables = Exact<{
  limit: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRecentActivityQuery = { __typename?: 'Query', recentActivity: Array<{ __typename?: 'ActivityItemType', id: string, type: string, description: string, actorName: string, actorAvatarUrl: string | null, actorRole: UserRole, entityId: string | null, entityType: string | null, createdAt: any }> };

export type GetUsersQueryVariables = Exact<{
  filters: InputMaybe<UserFiltersInput>;
}>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'UserType', id: string, name: string, email: string, role: UserRole, avatarUrl: string | null, createdAt: any, groups: Array<{ __typename?: 'UserGroupType', id: string, name: string }> | null }> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'UserType', id: string, name: string, email: string, role: UserRole, avatarUrl: string | null, createdAt: any, groups: Array<{ __typename?: 'UserGroupType', id: string, name: string }> | null } | null };

export type GetGroupsQueryVariables = Exact<{
  filters: InputMaybe<GroupFiltersInput>;
}>;


export type GetGroupsQuery = { __typename?: 'Query', getGroups: Array<{ __typename?: 'GroupType', id: string, name: string, description: string, memberCount: number, createdBy: string, createdAt: any }> };

export type GetGroupQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGroupQuery = { __typename?: 'Query', getGroup: { __typename?: 'GroupWithMembersType', id: string, name: string, description: string, memberCount: number, createdBy: string, createdAt: any, members: Array<{ __typename?: 'GroupMemberType', id: string, name: string, email: string, role: UserRole, avatarUrl: string | null, joinedAt: any }> } | null };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserType', id: string, name: string, email: string, role: UserRole } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserType', id: string, name: string, email: string, role: UserRole } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type BulkDeleteUsersMutationVariables = Exact<{
  input: BulkDeleteUsersInput;
}>;


export type BulkDeleteUsersMutation = { __typename?: 'Mutation', bulkDeleteUsers: boolean };

export type BulkUpdateUsersMutationVariables = Exact<{
  input: BulkUpdateUsersInput;
}>;


export type BulkUpdateUsersMutation = { __typename?: 'Mutation', bulkUpdateUsers: boolean };

export type ImportUsersMutationVariables = Exact<{
  input: ImportUsersInput;
}>;


export type ImportUsersMutation = { __typename?: 'Mutation', importUsers: { __typename?: 'ImportUsersResultType', created: number, skipped: number, errors: Array<string> } };

export type CreateGroupMutationVariables = Exact<{
  input: CreateGroupInput;
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'GroupType', id: string, name: string, description: string } };

export type UpdateGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateGroupInput;
}>;


export type UpdateGroupMutation = { __typename?: 'Mutation', updateGroup: { __typename?: 'GroupType', id: string, name: string, description: string } };

export type DeleteGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteGroupMutation = { __typename?: 'Mutation', deleteGroup: boolean };

export type AddMemberToGroupMutationVariables = Exact<{
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type AddMemberToGroupMutation = { __typename?: 'Mutation', addMemberToGroup: boolean };

export type RemoveMemberFromGroupMutationVariables = Exact<{
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type RemoveMemberFromGroupMutation = { __typename?: 'Mutation', removeMemberFromGroup: boolean };

export type CreateNoteMutationVariables = Exact<{
  input: CreateNoteInput;
}>;


export type CreateNoteMutation = { __typename?: 'Mutation', createNote: { __typename?: 'NoteType', id: string, content: string, createdAt: any, updatedAt: any } };

export type UpdateNoteMutationVariables = Exact<{
  input: UpdateNoteInput;
}>;


export type UpdateNoteMutation = { __typename?: 'Mutation', updateNote: { __typename?: 'NoteType', id: string, content: string, updatedAt: any } };

export type DeleteNoteMutationVariables = Exact<{
  input: DeleteNoteInput;
}>;


export type DeleteNoteMutation = { __typename?: 'Mutation', deleteNote: boolean };

export type GetNotesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotesQuery = { __typename?: 'Query', notes: Array<{ __typename?: 'NoteType', id: string, content: string, createdAt: any, updatedAt: any }> };

export type CreateTaskItemMutationVariables = Exact<{
  input: CreateTaskItemInput;
}>;


export type CreateTaskItemMutation = { __typename?: 'Mutation', createTaskItem: { __typename?: 'TaskItemType', id: string, text: string, completed: boolean, order: number } };

export type UpdateTaskItemMutationVariables = Exact<{
  input: UpdateTaskItemInput;
}>;


export type UpdateTaskItemMutation = { __typename?: 'Mutation', updateTaskItem: { __typename?: 'TaskItemType', id: string, text: string, completed: boolean } };

export type DeleteTaskItemMutationVariables = Exact<{
  input: DeleteTaskItemInput;
}>;


export type DeleteTaskItemMutation = { __typename?: 'Mutation', deleteTaskItem: boolean };

export type ReorderTaskItemsMutationVariables = Exact<{
  input: ReorderTaskItemsInput;
}>;


export type ReorderTaskItemsMutation = { __typename?: 'Mutation', reorderTaskItems: boolean };

export type GetTaskItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTaskItemsQuery = { __typename?: 'Query', taskItems: Array<{ __typename?: 'TaskItemType', id: string, text: string, completed: boolean, order: number, createdAt: any, updatedAt: any }> };

export type GetToolsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetToolsQuery = { __typename?: 'Query', tools: Array<{ __typename?: 'ToolType', id: string, name: string, slug: string, description: string, icon: string, color: string, category: { __typename?: 'ToolCategoryType', id: string, name: string, slug: string, order: number } }> };

export type CreateRecordingMutationVariables = Exact<{
  input: CreateRecordingInput;
}>;


export type CreateRecordingMutation = { __typename?: 'Mutation', createRecording: { __typename?: 'RecordingType', id: string, name: string, transcriptionStatus: string } };

export type DeleteRecordingMutationVariables = Exact<{
  input: DeleteRecordingInput;
}>;


export type DeleteRecordingMutation = { __typename?: 'Mutation', deleteRecording: boolean };

export type GetSummaryPromptQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSummaryPromptQuery = { __typename?: 'Query', getSummaryPrompt: string };

export type UpdateSummaryPromptMutationVariables = Exact<{
  input: UpdateSummaryPromptInput;
}>;


export type UpdateSummaryPromptMutation = { __typename?: 'Mutation', updateSummaryPrompt: boolean };

export type GetRecordingQueryVariables = Exact<{
  input: GetRecordingInput;
}>;


export type GetRecordingQuery = { __typename?: 'Query', getRecording: { __typename?: 'RecordingType', id: string, name: string, duration: number, audioUrl: string | null, transcriptionStatus: string, createdAt: any, transcription: { __typename?: 'TranscriptionType', status: string, summaryStatus: string, summaryError: string | null, fullTranscript: string | null, segments: string | null, summary: string | null, keyTakeaways: Array<string>, actionItems: Array<string>, completedAt: any | null } | null } };

export type GetRecordingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecordingsQuery = { __typename?: 'Query', getRecordings: Array<{ __typename?: 'RecordingType', id: string, name: string, duration: number, audioUrl: string | null, transcriptionStatus: string, createdAt: any }> };

export type UpdateTranscriptionMutationVariables = Exact<{
  input: UpdateTranscriptionInput;
}>;


export type UpdateTranscriptionMutation = { __typename?: 'Mutation', updateTranscription: boolean };

export type GenerateSummaryMutationVariables = Exact<{
  input: GenerateSummaryInput;
}>;


export type GenerateSummaryMutation = { __typename?: 'Mutation', generateSummary: boolean };

export type GetRecordingDetailQueryVariables = Exact<{
  input: GetRecordingInput;
}>;


export type GetRecordingDetailQuery = { __typename?: 'Query', getRecording: { __typename?: 'RecordingType', id: string, name: string, duration: number, audioUrl: string | null, transcriptionStatus: string, createdAt: any, transcription: { __typename?: 'TranscriptionType', status: string, summaryStatus: string, summaryError: string | null, fullTranscript: string | null, segments: string | null, summary: string | null, keyTakeaways: Array<string>, actionItems: Array<string>, completedAt: any | null } | null } };


export const RecordAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RecordAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RecordAttendanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<RecordAttendanceMutation, RecordAttendanceMutationVariables>;
export const ExportAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExportAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExportAttendanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exportAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobId"}}]}}]}}]} as unknown as DocumentNode<ExportAttendanceMutation, ExportAttendanceMutationVariables>;
export const GetAttendanceGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAttendanceGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendanceGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"todayRate"}},{"kind":"Field","name":{"kind":"Name","value":"todaySubmitted"}}]}}]}}]} as unknown as DocumentNode<GetAttendanceGroupsQuery, GetAttendanceGroupsQueryVariables>;
export const GetAttendanceRosterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAttendanceRoster"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendanceRoster"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"todayRate"}},{"kind":"Field","name":{"kind":"Name","value":"todaySubmitted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"roster"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetAttendanceRosterQuery, GetAttendanceRosterQueryVariables>;
export const GetAttendanceReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAttendanceReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportPeriod"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendanceReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"studentName"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceRate"}},{"kind":"Field","name":{"kind":"Name","value":"presentCount"}},{"kind":"Field","name":{"kind":"Name","value":"absentCount"}},{"kind":"Field","name":{"kind":"Name","value":"lateCount"}},{"kind":"Field","name":{"kind":"Name","value":"excusedCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalDays"}}]}}]}}]} as unknown as DocumentNode<GetAttendanceReportQuery, GetAttendanceReportQueryVariables>;
export const GetStudentAttendanceHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStudentAttendanceHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentAttendanceHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"groupName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetStudentAttendanceHistoryQuery, GetStudentAttendanceHistoryQueryVariables>;
export const GetStudentAttendanceSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStudentAttendanceSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentAttendanceSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"overallRate"}},{"kind":"Field","name":{"kind":"Name","value":"currentStreak"}},{"kind":"Field","name":{"kind":"Name","value":"groupCount"}}]}}]}}]} as unknown as DocumentNode<GetStudentAttendanceSummaryQuery, GetStudentAttendanceSummaryQueryVariables>;
export const GetExportStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExportStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendanceExportStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"jobId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"downloadUrl"}}]}}]}}]} as unknown as DocumentNode<GetExportStatusQuery, GetExportStatusQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefreshTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const CreatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreatePostMutation, CreatePostMutationVariables>;
export const UpdatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdatePostMutation, UpdatePostMutationVariables>;
export const DeletePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeletePostMutation, DeletePostMutationVariables>;
export const ReviewDraftDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReviewDraft"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReviewDraftInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewDraft"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<ReviewDraftMutation, ReviewDraftMutationVariables>;
export const ToggleReactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleReaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emoji"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleReaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"commentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"emoji"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emoji"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"userReacted"}}]}}]}}]} as unknown as DocumentNode<ToggleReactionMutation, ToggleReactionMutationVariables>;
export const AddCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"gifUrl"}},{"kind":"Field","name":{"kind":"Name","value":"gifAlt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<AddCommentMutation, AddCommentMutationVariables>;
export const UpdateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<UpdateCommentMutation, UpdateCommentMutationVariables>;
export const DeleteCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const GetPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostFiltersInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactionSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"userReacted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}}]}}]}}]} as unknown as DocumentNode<GetPostsQuery, GetPostsQueryVariables>;
export const GetPostByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPostById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionNote"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactionSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"userReacted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"publicId"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]}}]} as unknown as DocumentNode<GetPostByIdQuery, GetPostByIdQueryVariables>;
export const GetCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetDraftQueueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDraftQueue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"draftQueue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetDraftQueueQuery, GetDraftQueueQueryVariables>;
export const GetMyDraftsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyDrafts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myDrafts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"rejectionNote"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetMyDraftsQuery, GetMyDraftsQueryVariables>;
export const GetFeedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFeed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostFiltersInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactionSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"userReacted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"publicId"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetFeedQuery, GetFeedQueryVariables>;
export const GetCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"gifUrl"}},{"kind":"Field","name":{"kind":"Name","value":"gifAlt"}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"reactionSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"userReacted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetCommentsQuery, GetCommentsQueryVariables>;
export const GetRepliesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetReplies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"replies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"parentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"gifUrl"}},{"kind":"Field","name":{"kind":"Name","value":"gifAlt"}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"reactionSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"userReacted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetRepliesQuery, GetRepliesQueryVariables>;
export const GetAdminDashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}},{"kind":"Field","name":{"kind":"Name","value":"totalGroups"}},{"kind":"Field","name":{"kind":"Name","value":"publishedPostsThisMonth"}},{"kind":"Field","name":{"kind":"Name","value":"publishedPostsLastMonth"}},{"kind":"Field","name":{"kind":"Name","value":"globalAttendanceRateThisWeek"}},{"kind":"Field","name":{"kind":"Name","value":"globalAttendanceRateLastWeek"}},{"kind":"Field","name":{"kind":"Name","value":"usersByRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"admin"}},{"kind":"Field","name":{"kind":"Name","value":"teacher"}},{"kind":"Field","name":{"kind":"Name","value":"student"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postsByStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"draft"}},{"kind":"Field","name":{"kind":"Name","value":"rejected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendanceTrend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}}]}}]}}]} as unknown as DocumentNode<GetAdminDashboardQuery, GetAdminDashboardQueryVariables>;
export const GetTeacherDashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeacherDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacherDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myGroupCount"}},{"kind":"Field","name":{"kind":"Name","value":"myGroupsTodayRate"}},{"kind":"Field","name":{"kind":"Name","value":"myPostCount"}},{"kind":"Field","name":{"kind":"Name","value":"pendingAttendanceCount"}},{"kind":"Field","name":{"kind":"Name","value":"myGroupAttendanceTrend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"groupName"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"myPostsByStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"draft"}},{"kind":"Field","name":{"kind":"Name","value":"rejected"}}]}}]}}]}}]} as unknown as DocumentNode<GetTeacherDashboardQuery, GetTeacherDashboardQueryVariables>;
export const GetStudentDashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStudentDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAttendanceRate"}},{"kind":"Field","name":{"kind":"Name","value":"myCurrentStreak"}},{"kind":"Field","name":{"kind":"Name","value":"myDraftCount"}},{"kind":"Field","name":{"kind":"Name","value":"myGroupMembershipCount"}},{"kind":"Field","name":{"kind":"Name","value":"myAttendanceTrend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetStudentDashboardQuery, GetStudentDashboardQueryVariables>;
export const GetRecentActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRecentActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recentActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"actorAvatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"actorRole"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetRecentActivityQuery, GetRecentActivityQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFiltersInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const GetGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GroupFiltersInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetGroupsQuery, GetGroupsQueryVariables>;
export const GetGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetGroupQuery, GetGroupQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const BulkDeleteUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkDeleteUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BulkDeleteUsersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkDeleteUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<BulkDeleteUsersMutation, BulkDeleteUsersMutationVariables>;
export const BulkUpdateUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkUpdateUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BulkUpdateUsersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkUpdateUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<BulkUpdateUsersMutation, BulkUpdateUsersMutationVariables>;
export const ImportUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImportUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImportUsersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"importUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"skipped"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<ImportUsersMutation, ImportUsersMutationVariables>;
export const CreateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<CreateGroupMutation, CreateGroupMutationVariables>;
export const UpdateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<UpdateGroupMutation, UpdateGroupMutationVariables>;
export const DeleteGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteGroupMutation, DeleteGroupMutationVariables>;
export const AddMemberToGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMemberToGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMemberToGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}]}}]} as unknown as DocumentNode<AddMemberToGroupMutation, AddMemberToGroupMutationVariables>;
export const RemoveMemberFromGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMemberFromGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMemberFromGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}]}}]} as unknown as DocumentNode<RemoveMemberFromGroupMutation, RemoveMemberFromGroupMutationVariables>;
export const CreateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateNoteMutation, CreateNoteMutationVariables>;
export const UpdateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateNoteMutation, UpdateNoteMutationVariables>;
export const DeleteNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteNoteMutation, DeleteNoteMutationVariables>;
export const GetNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetNotesQuery, GetNotesQueryVariables>;
export const CreateTaskItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTaskItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTaskItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTaskItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]} as unknown as DocumentNode<CreateTaskItemMutation, CreateTaskItemMutationVariables>;
export const UpdateTaskItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTaskItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTaskItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTaskItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}}]}}]}}]} as unknown as DocumentNode<UpdateTaskItemMutation, UpdateTaskItemMutationVariables>;
export const DeleteTaskItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTaskItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteTaskItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTaskItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteTaskItemMutation, DeleteTaskItemMutationVariables>;
export const ReorderTaskItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderTaskItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderTaskItemsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reorderTaskItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ReorderTaskItemsMutation, ReorderTaskItemsMutationVariables>;
export const GetTaskItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTaskItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetTaskItemsQuery, GetTaskItemsQueryVariables>;
export const GetToolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]}}]} as unknown as DocumentNode<GetToolsQuery, GetToolsQueryVariables>;
export const CreateRecordingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRecording"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRecordingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRecording"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptionStatus"}}]}}]}}]} as unknown as DocumentNode<CreateRecordingMutation, CreateRecordingMutationVariables>;
export const DeleteRecordingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRecording"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteRecordingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRecording"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteRecordingMutation, DeleteRecordingMutationVariables>;
export const GetSummaryPromptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSummaryPrompt"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSummaryPrompt"}}]}}]} as unknown as DocumentNode<GetSummaryPromptQuery, GetSummaryPromptQueryVariables>;
export const UpdateSummaryPromptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSummaryPrompt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSummaryPromptInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSummaryPrompt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateSummaryPromptMutation, UpdateSummaryPromptMutationVariables>;
export const GetRecordingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRecording"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetRecordingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRecording"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"audioUrl"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptionStatus"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"transcription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"summaryStatus"}},{"kind":"Field","name":{"kind":"Name","value":"summaryError"}},{"kind":"Field","name":{"kind":"Name","value":"fullTranscript"}},{"kind":"Field","name":{"kind":"Name","value":"segments"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"keyTakeaways"}},{"kind":"Field","name":{"kind":"Name","value":"actionItems"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetRecordingQuery, GetRecordingQueryVariables>;
export const GetRecordingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRecordings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRecordings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"audioUrl"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptionStatus"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetRecordingsQuery, GetRecordingsQueryVariables>;
export const UpdateTranscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTranscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTranscriptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTranscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateTranscriptionMutation, UpdateTranscriptionMutationVariables>;
export const GenerateSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateSummary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GenerateSummaryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateSummary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<GenerateSummaryMutation, GenerateSummaryMutationVariables>;
export const GetRecordingDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRecordingDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetRecordingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRecording"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"audioUrl"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptionStatus"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"transcription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"summaryStatus"}},{"kind":"Field","name":{"kind":"Name","value":"summaryError"}},{"kind":"Field","name":{"kind":"Name","value":"fullTranscript"}},{"kind":"Field","name":{"kind":"Name","value":"segments"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"keyTakeaways"}},{"kind":"Field","name":{"kind":"Name","value":"actionItems"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetRecordingDetailQuery, GetRecordingDetailQueryVariables>;