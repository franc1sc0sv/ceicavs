/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation RecordAttendance($input: RecordAttendanceInput!) {\n    recordAttendance(input: $input)\n  }\n": typeof types.RecordAttendanceDocument,
    "\n  mutation ExportAttendance($input: ExportAttendanceInput!) {\n    exportAttendance(input: $input) {\n      jobId\n    }\n  }\n": typeof types.ExportAttendanceDocument,
    "\n  query GetAttendanceGroups {\n    attendanceGroups {\n      id\n      name\n      memberCount\n      todayRate\n      todaySubmitted\n    }\n  }\n": typeof types.GetAttendanceGroupsDocument,
    "\n  query GetAttendanceRoster($groupId: String!, $date: String!) {\n    attendanceRoster(groupId: $groupId, date: $date) {\n      group {\n        id\n        name\n        memberCount\n        todayRate\n        todaySubmitted\n      }\n      date\n      roster {\n        id\n        name\n        avatarUrl\n        status\n      }\n    }\n  }\n": typeof types.GetAttendanceRosterDocument,
    "\n  query GetAttendanceReport($groupId: String!, $period: ReportPeriod!, $date: String) {\n    attendanceReport(groupId: $groupId, period: $period, date: $date) {\n      studentId\n      studentName\n      attendanceRate\n      presentCount\n      absentCount\n      lateCount\n      excusedCount\n      totalDays\n    }\n  }\n": typeof types.GetAttendanceReportDocument,
    "\n  query GetStudentAttendanceHistory {\n    studentAttendanceHistory {\n      id\n      date\n      groupName\n      status\n    }\n  }\n": typeof types.GetStudentAttendanceHistoryDocument,
    "\n  query GetStudentAttendanceSummary {\n    studentAttendanceSummary {\n      overallRate\n      currentStreak\n      groupCount\n    }\n  }\n": typeof types.GetStudentAttendanceSummaryDocument,
    "\n  query GetExportStatus($jobId: String!) {\n    attendanceExportStatus(jobId: $jobId) {\n      jobId\n      status\n      downloadUrl\n    }\n  }\n": typeof types.GetExportStatusDocument,
    "\n  query AttendanceReportByRange($input: AttendanceReportByRangeInput!) {\n    attendanceReportByRange(input: $input) {\n      groupId\n      groupName\n      dateFrom\n      dateTo\n      summary {\n        totalStudents\n        averageRate\n        totalPresent\n        totalAbsent\n        totalLate\n        totalExcused\n        totalSessions\n      }\n      students {\n        studentId\n        studentName\n        attendanceRate\n        presentCount\n        absentCount\n        lateCount\n        excusedCount\n        totalDays\n      }\n    }\n  }\n": typeof types.AttendanceReportByRangeDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation RefreshToken($input: RefreshTokenInput!) {\n    refreshToken(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.RefreshTokenDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      role\n      avatarUrl\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation RequestLoginCode($input: RequestLoginCodeInput!) {\n    requestLoginCode(input: $input)\n  }\n": typeof types.RequestLoginCodeDocument,
    "\n  mutation LoginWithCode($input: LoginWithCodeInput!) {\n    loginWithCode(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.LoginWithCodeDocument,
    "\n  mutation CreatePost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n      status\n    }\n  }\n": typeof types.CreatePostDocument,
    "\n  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {\n    updatePost(id: $id, input: $input) {\n      id\n    }\n  }\n": typeof types.UpdatePostDocument,
    "\n  mutation DeletePost($id: ID!) {\n    deletePost(id: $id)\n  }\n": typeof types.DeletePostDocument,
    "\n  mutation ReviewDraft($id: ID!, $input: ReviewDraftInput!) {\n    reviewDraft(id: $id, input: $input) {\n      id\n      status\n    }\n  }\n": typeof types.ReviewDraftDocument,
    "\n  mutation ToggleReaction($postId: ID, $commentId: ID, $emoji: String) {\n    toggleReaction(postId: $postId, commentId: $commentId, emoji: $emoji) {\n      emoji\n      count\n      userReacted\n    }\n  }\n": typeof types.ToggleReactionDocument,
    "\n  mutation AddComment($input: AddCommentInput!) {\n    addComment(input: $input) {\n      id\n      text\n      parentId\n      depth\n      gifUrl\n      gifAlt\n      createdAt\n      author {\n        id\n        name\n        avatarUrl\n        role\n      }\n    }\n  }\n": typeof types.AddCommentDocument,
    "\n  mutation UpdateComment($id: ID!, $text: String!) {\n    updateComment(id: $id, text: $text) {\n      id\n      text\n    }\n  }\n": typeof types.UpdateCommentDocument,
    "\n  mutation DeleteComment($id: ID!) {\n    deleteComment(id: $id)\n  }\n": typeof types.DeleteCommentDocument,
    "\n  mutation CreateCategory($name: String!) {\n    createCategory(name: $name) {\n      id\n      name\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($id: ID!, $name: String!) {\n    updateCategory(id: $id, name: $name) {\n      id\n      name\n    }\n  }\n": typeof types.UpdateCategoryDocument,
    "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n": typeof types.DeleteCategoryDocument,
    "\n  query GetPosts($filters: PostFiltersInput) {\n    posts(filters: $filters) {\n      id\n      title\n      excerpt\n      status\n      createdAt\n      author {\n        id\n        name\n        avatarUrl\n        role\n      }\n      categories {\n        id\n        name\n      }\n      reactionSummary {\n        emoji\n        count\n        userReacted\n      }\n      commentCount\n    }\n  }\n": typeof types.GetPostsDocument,
    "\n  query GetPostById($id: ID!) {\n    post(id: $id) {\n      id\n      title\n      excerpt\n      content\n      status\n      createdAt\n      updatedAt\n      rejectionNote\n      publishedAt\n      author {\n        id\n        name\n        avatarUrl\n        role\n      }\n      categories {\n        id\n        name\n      }\n      reactionSummary {\n        emoji\n        count\n        userReacted\n      }\n      images {\n        id\n        url\n        publicId\n        order\n      }\n    }\n  }\n": typeof types.GetPostByIdDocument,
    "\n  query GetCategories {\n    categories {\n      id\n      name\n    }\n  }\n": typeof types.GetCategoriesDocument,
    "\n  query GetDraftQueue {\n    draftQueue {\n      id\n      title\n      excerpt\n      createdAt\n      author {\n        id\n        name\n        avatarUrl\n      }\n      categories {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetDraftQueueDocument,
    "\n  query GetMyDrafts {\n    myDrafts {\n      id\n      title\n      status\n      rejectionNote\n      createdAt\n      updatedAt\n      categories {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetMyDraftsDocument,
    "\n  query GetFeed($filters: PostFiltersInput, $cursor: String, $limit: Int) {\n    feed(filters: $filters, cursor: $cursor, limit: $limit) {\n      items {\n        id\n        title\n        excerpt\n        status\n        createdAt\n        publishedAt\n        authorId\n        author {\n          id\n          name\n          avatarUrl\n          role\n        }\n        categories {\n          id\n          name\n        }\n        reactionSummary {\n          emoji\n          count\n          userReacted\n        }\n        commentCount\n        images {\n          id\n          url\n          publicId\n          order\n        }\n      }\n      nextCursor\n    }\n  }\n": typeof types.GetFeedDocument,
    "\n  query GetComments($postId: ID!, $cursor: String, $limit: Int) {\n    comments(postId: $postId, cursor: $cursor, limit: $limit) {\n      items {\n        id\n        text\n        parentId\n        postId\n        depth\n        gifUrl\n        gifAlt\n        replyCount\n        reactionSummary {\n          emoji\n          count\n          userReacted\n        }\n        createdAt\n        updatedAt\n        author {\n          id\n          name\n          avatarUrl\n          role\n        }\n      }\n      nextCursor\n    }\n  }\n": typeof types.GetCommentsDocument,
    "\n  query GetReplies($parentId: ID!, $cursor: String, $limit: Int) {\n    replies(parentId: $parentId, cursor: $cursor, limit: $limit) {\n      items {\n        id\n        text\n        parentId\n        postId\n        depth\n        gifUrl\n        gifAlt\n        replyCount\n        reactionSummary {\n          emoji\n          count\n          userReacted\n        }\n        createdAt\n        updatedAt\n        author {\n          id\n          name\n          avatarUrl\n          role\n        }\n      }\n      nextCursor\n    }\n  }\n": typeof types.GetRepliesDocument,
    "\n  query GetAdminDashboard {\n    adminDashboard {\n      totalUsers\n      totalGroups\n      publishedPostsThisMonth\n      publishedPostsLastMonth\n      globalAttendanceRateThisWeek\n      globalAttendanceRateLastWeek\n      usersByRole {\n        admin\n        teacher\n        student\n      }\n      postsByStatus {\n        published\n        draft\n        pending\n        rejected\n      }\n      attendanceTrend {\n        date\n        rate\n      }\n    }\n  }\n": typeof types.GetAdminDashboardDocument,
    "\n  query GetTeacherDashboard {\n    teacherDashboard {\n      myGroupCount\n      myGroupsTodayRate\n      myPostCount\n      pendingAttendanceCount\n      myGroupAttendanceTrend {\n        groupId\n        groupName\n        points {\n          date\n          rate\n        }\n      }\n      myPostsByStatus {\n        published\n        draft\n        pending\n        rejected\n      }\n    }\n  }\n": typeof types.GetTeacherDashboardDocument,
    "\n  query GetStudentDashboard {\n    studentDashboard {\n      myAttendanceRate\n      myCurrentStreak\n      myDraftCount\n      myGroupMembershipCount\n      myAttendanceTrend {\n        date\n        status\n      }\n    }\n  }\n": typeof types.GetStudentDashboardDocument,
    "\n  query GetRecentActivity($limit: Int) {\n    recentActivity(limit: $limit) {\n      id\n      type\n      description\n      actorName\n      actorAvatarUrl\n      actorRole\n      entityId\n      entityType\n      createdAt\n    }\n  }\n": typeof types.GetRecentActivityDocument,
    "\n  query GetUsers($filters: UserFiltersInput) {\n    getUsers(filters: $filters) {\n      id\n      name\n      email\n      role\n      avatarUrl\n      createdAt\n      groups {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetUsersDocument,
    "\n  query GetUser($id: ID!) {\n    getUser(id: $id) {\n      id\n      name\n      email\n      role\n      avatarUrl\n      createdAt\n      groups {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetUserDocument,
    "\n  query GetGroups($filters: GroupFiltersInput) {\n    getGroups(filters: $filters) {\n      id\n      name\n      description\n      memberCount\n      createdBy\n      createdAt\n    }\n  }\n": typeof types.GetGroupsDocument,
    "\n  query GetGroup($id: ID!) {\n    getGroup(id: $id) {\n      id\n      name\n      description\n      memberCount\n      createdBy\n      createdAt\n      members {\n        id\n        name\n        email\n        role\n        avatarUrl\n        joinedAt\n      }\n    }\n  }\n": typeof types.GetGroupDocument,
    "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      id\n      name\n      email\n      role\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      id\n      name\n      email\n      role\n    }\n  }\n": typeof types.UpdateUserDocument,
    "\n  mutation DeleteUser($id: ID!) {\n    deleteUser(id: $id)\n  }\n": typeof types.DeleteUserDocument,
    "\n  mutation BulkDeleteUsers($input: BulkDeleteUsersInput!) {\n    bulkDeleteUsers(input: $input)\n  }\n": typeof types.BulkDeleteUsersDocument,
    "\n  mutation BulkUpdateUsers($input: BulkUpdateUsersInput!) {\n    bulkUpdateUsers(input: $input)\n  }\n": typeof types.BulkUpdateUsersDocument,
    "\n  mutation ImportUsers($input: ImportUsersInput!) {\n    importUsers(input: $input) {\n      created\n      skipped\n      errors\n    }\n  }\n": typeof types.ImportUsersDocument,
    "\n  mutation CreateGroup($input: CreateGroupInput!) {\n    createGroup(input: $input) {\n      id\n      name\n      description\n    }\n  }\n": typeof types.CreateGroupDocument,
    "\n  mutation UpdateGroup($id: ID!, $input: UpdateGroupInput!) {\n    updateGroup(id: $id, input: $input) {\n      id\n      name\n      description\n    }\n  }\n": typeof types.UpdateGroupDocument,
    "\n  mutation DeleteGroup($id: ID!) {\n    deleteGroup(id: $id)\n  }\n": typeof types.DeleteGroupDocument,
    "\n  mutation AddMemberToGroup($groupId: ID!, $userId: ID!) {\n    addMemberToGroup(groupId: $groupId, userId: $userId)\n  }\n": typeof types.AddMemberToGroupDocument,
    "\n  mutation RemoveMemberFromGroup($groupId: ID!, $userId: ID!) {\n    removeMemberFromGroup(groupId: $groupId, userId: $userId)\n  }\n": typeof types.RemoveMemberFromGroupDocument,
    "\n  mutation CreateNote($input: CreateNoteInput!) {\n    createNote(input: $input) {\n      id\n      content\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateNoteDocument,
    "\n  mutation UpdateNote($input: UpdateNoteInput!) {\n    updateNote(input: $input) {\n      id\n      content\n      updatedAt\n    }\n  }\n": typeof types.UpdateNoteDocument,
    "\n  mutation DeleteNote($input: DeleteNoteInput!) {\n    deleteNote(input: $input)\n  }\n": typeof types.DeleteNoteDocument,
    "\n  query GetNotes {\n    notes {\n      id\n      content\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetNotesDocument,
    "\n  mutation CreateTaskItem($input: CreateTaskItemInput!) {\n    createTaskItem(input: $input) {\n      id\n      text\n      completed\n      order\n    }\n  }\n": typeof types.CreateTaskItemDocument,
    "\n  mutation UpdateTaskItem($input: UpdateTaskItemInput!) {\n    updateTaskItem(input: $input) {\n      id\n      text\n      completed\n    }\n  }\n": typeof types.UpdateTaskItemDocument,
    "\n  mutation DeleteTaskItem($input: DeleteTaskItemInput!) {\n    deleteTaskItem(input: $input)\n  }\n": typeof types.DeleteTaskItemDocument,
    "\n  mutation ReorderTaskItems($input: ReorderTaskItemsInput!) {\n    reorderTaskItems(input: $input)\n  }\n": typeof types.ReorderTaskItemsDocument,
    "\n  query GetTaskItems {\n    taskItems {\n      id\n      text\n      completed\n      order\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetTaskItemsDocument,
    "\n  query GetTools {\n    tools {\n      id\n      name\n      slug\n      description\n      icon\n      color\n      category {\n        id\n        name\n        slug\n        order\n      }\n    }\n  }\n": typeof types.GetToolsDocument,
    "\n  mutation CreateRecording($input: CreateRecordingInput!) {\n    createRecording(input: $input) {\n      id\n      name\n      transcriptionStatus\n    }\n  }\n": typeof types.CreateRecordingDocument,
    "\n  mutation DeleteRecording($input: DeleteRecordingInput!) {\n    deleteRecording(input: $input)\n  }\n": typeof types.DeleteRecordingDocument,
    "\n  query GetSummaryPrompt {\n    getSummaryPrompt\n  }\n": typeof types.GetSummaryPromptDocument,
    "\n  mutation UpdateSummaryPrompt($input: UpdateSummaryPromptInput!) {\n    updateSummaryPrompt(input: $input)\n  }\n": typeof types.UpdateSummaryPromptDocument,
    "\n  query GetRecording($input: GetRecordingInput!) {\n    getRecording(input: $input) {\n      id\n      name\n      duration\n      audioUrl\n      transcriptionStatus\n      createdAt\n      transcription {\n        status\n        summaryStatus\n        summaryError\n        fullTranscript\n        segments\n        summary\n        keyTakeaways\n        actionItems\n        completedAt\n      }\n    }\n  }\n": typeof types.GetRecordingDocument,
    "\n  query GetRecordings {\n    getRecordings {\n      id\n      name\n      duration\n      audioUrl\n      transcriptionStatus\n      createdAt\n    }\n  }\n": typeof types.GetRecordingsDocument,
    "\n  mutation UpdateTranscription($input: UpdateTranscriptionInput!) {\n    updateTranscription(input: $input)\n  }\n": typeof types.UpdateTranscriptionDocument,
    "\n  mutation GenerateSummary($input: GenerateSummaryInput!) {\n    generateSummary(input: $input)\n  }\n": typeof types.GenerateSummaryDocument,
    "\n  query GetAITokenUsage {\n    getAITokenUsage {\n      groq {\n        remaining\n        limit\n        percentRemaining\n      }\n      gemini {\n        usedToday\n        dailyLimit\n        percentRemaining\n      }\n    }\n  }\n": typeof types.GetAiTokenUsageDocument,
    "\n  query GetRecordingDetail($input: GetRecordingInput!) {\n    getRecording(input: $input) {\n      id\n      name\n      duration\n      audioUrl\n      transcriptionStatus\n      createdAt\n      transcription {\n        status\n        summaryStatus\n        summaryError\n        fullTranscript\n        segments\n        summary\n        keyTakeaways\n        actionItems\n        completedAt\n      }\n    }\n  }\n": typeof types.GetRecordingDetailDocument,
};
const documents: Documents = {
    "\n  mutation RecordAttendance($input: RecordAttendanceInput!) {\n    recordAttendance(input: $input)\n  }\n": types.RecordAttendanceDocument,
    "\n  mutation ExportAttendance($input: ExportAttendanceInput!) {\n    exportAttendance(input: $input) {\n      jobId\n    }\n  }\n": types.ExportAttendanceDocument,
    "\n  query GetAttendanceGroups {\n    attendanceGroups {\n      id\n      name\n      memberCount\n      todayRate\n      todaySubmitted\n    }\n  }\n": types.GetAttendanceGroupsDocument,
    "\n  query GetAttendanceRoster($groupId: String!, $date: String!) {\n    attendanceRoster(groupId: $groupId, date: $date) {\n      group {\n        id\n        name\n        memberCount\n        todayRate\n        todaySubmitted\n      }\n      date\n      roster {\n        id\n        name\n        avatarUrl\n        status\n      }\n    }\n  }\n": types.GetAttendanceRosterDocument,
    "\n  query GetAttendanceReport($groupId: String!, $period: ReportPeriod!, $date: String) {\n    attendanceReport(groupId: $groupId, period: $period, date: $date) {\n      studentId\n      studentName\n      attendanceRate\n      presentCount\n      absentCount\n      lateCount\n      excusedCount\n      totalDays\n    }\n  }\n": types.GetAttendanceReportDocument,
    "\n  query GetStudentAttendanceHistory {\n    studentAttendanceHistory {\n      id\n      date\n      groupName\n      status\n    }\n  }\n": types.GetStudentAttendanceHistoryDocument,
    "\n  query GetStudentAttendanceSummary {\n    studentAttendanceSummary {\n      overallRate\n      currentStreak\n      groupCount\n    }\n  }\n": types.GetStudentAttendanceSummaryDocument,
    "\n  query GetExportStatus($jobId: String!) {\n    attendanceExportStatus(jobId: $jobId) {\n      jobId\n      status\n      downloadUrl\n    }\n  }\n": types.GetExportStatusDocument,
    "\n  query AttendanceReportByRange($input: AttendanceReportByRangeInput!) {\n    attendanceReportByRange(input: $input) {\n      groupId\n      groupName\n      dateFrom\n      dateTo\n      summary {\n        totalStudents\n        averageRate\n        totalPresent\n        totalAbsent\n        totalLate\n        totalExcused\n        totalSessions\n      }\n      students {\n        studentId\n        studentName\n        attendanceRate\n        presentCount\n        absentCount\n        lateCount\n        excusedCount\n        totalDays\n      }\n    }\n  }\n": types.AttendanceReportByRangeDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.LoginDocument,
    "\n  mutation RefreshToken($input: RefreshTokenInput!) {\n    refreshToken(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.RefreshTokenDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      role\n      avatarUrl\n    }\n  }\n": types.MeDocument,
    "\n  mutation RequestLoginCode($input: RequestLoginCodeInput!) {\n    requestLoginCode(input: $input)\n  }\n": types.RequestLoginCodeDocument,
    "\n  mutation LoginWithCode($input: LoginWithCodeInput!) {\n    loginWithCode(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.LoginWithCodeDocument,
    "\n  mutation CreatePost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n      status\n    }\n  }\n": types.CreatePostDocument,
    "\n  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {\n    updatePost(id: $id, input: $input) {\n      id\n    }\n  }\n": types.UpdatePostDocument,
    "\n  mutation DeletePost($id: ID!) {\n    deletePost(id: $id)\n  }\n": types.DeletePostDocument,
    "\n  mutation ReviewDraft($id: ID!, $input: ReviewDraftInput!) {\n    reviewDraft(id: $id, input: $input) {\n      id\n      status\n    }\n  }\n": types.ReviewDraftDocument,
    "\n  mutation ToggleReaction($postId: ID, $commentId: ID, $emoji: String) {\n    toggleReaction(postId: $postId, commentId: $commentId, emoji: $emoji) {\n      emoji\n      count\n      userReacted\n    }\n  }\n": types.ToggleReactionDocument,
    "\n  mutation AddComment($input: AddCommentInput!) {\n    addComment(input: $input) {\n      id\n      text\n      parentId\n      depth\n      gifUrl\n      gifAlt\n      createdAt\n      author {\n        id\n        name\n        avatarUrl\n        role\n      }\n    }\n  }\n": types.AddCommentDocument,
    "\n  mutation UpdateComment($id: ID!, $text: String!) {\n    updateComment(id: $id, text: $text) {\n      id\n      text\n    }\n  }\n": types.UpdateCommentDocument,
    "\n  mutation DeleteComment($id: ID!) {\n    deleteComment(id: $id)\n  }\n": types.DeleteCommentDocument,
    "\n  mutation CreateCategory($name: String!) {\n    createCategory(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($id: ID!, $name: String!) {\n    updateCategory(id: $id, name: $name) {\n      id\n      name\n    }\n  }\n": types.UpdateCategoryDocument,
    "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n": types.DeleteCategoryDocument,
    "\n  query GetPosts($filters: PostFiltersInput) {\n    posts(filters: $filters) {\n      id\n      title\n      excerpt\n      status\n      createdAt\n      author {\n        id\n        name\n        avatarUrl\n        role\n      }\n      categories {\n        id\n        name\n      }\n      reactionSummary {\n        emoji\n        count\n        userReacted\n      }\n      commentCount\n    }\n  }\n": types.GetPostsDocument,
    "\n  query GetPostById($id: ID!) {\n    post(id: $id) {\n      id\n      title\n      excerpt\n      content\n      status\n      createdAt\n      updatedAt\n      rejectionNote\n      publishedAt\n      author {\n        id\n        name\n        avatarUrl\n        role\n      }\n      categories {\n        id\n        name\n      }\n      reactionSummary {\n        emoji\n        count\n        userReacted\n      }\n      images {\n        id\n        url\n        publicId\n        order\n      }\n    }\n  }\n": types.GetPostByIdDocument,
    "\n  query GetCategories {\n    categories {\n      id\n      name\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  query GetDraftQueue {\n    draftQueue {\n      id\n      title\n      excerpt\n      createdAt\n      author {\n        id\n        name\n        avatarUrl\n      }\n      categories {\n        id\n        name\n      }\n    }\n  }\n": types.GetDraftQueueDocument,
    "\n  query GetMyDrafts {\n    myDrafts {\n      id\n      title\n      status\n      rejectionNote\n      createdAt\n      updatedAt\n      categories {\n        id\n        name\n      }\n    }\n  }\n": types.GetMyDraftsDocument,
    "\n  query GetFeed($filters: PostFiltersInput, $cursor: String, $limit: Int) {\n    feed(filters: $filters, cursor: $cursor, limit: $limit) {\n      items {\n        id\n        title\n        excerpt\n        status\n        createdAt\n        publishedAt\n        authorId\n        author {\n          id\n          name\n          avatarUrl\n          role\n        }\n        categories {\n          id\n          name\n        }\n        reactionSummary {\n          emoji\n          count\n          userReacted\n        }\n        commentCount\n        images {\n          id\n          url\n          publicId\n          order\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetFeedDocument,
    "\n  query GetComments($postId: ID!, $cursor: String, $limit: Int) {\n    comments(postId: $postId, cursor: $cursor, limit: $limit) {\n      items {\n        id\n        text\n        parentId\n        postId\n        depth\n        gifUrl\n        gifAlt\n        replyCount\n        reactionSummary {\n          emoji\n          count\n          userReacted\n        }\n        createdAt\n        updatedAt\n        author {\n          id\n          name\n          avatarUrl\n          role\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetCommentsDocument,
    "\n  query GetReplies($parentId: ID!, $cursor: String, $limit: Int) {\n    replies(parentId: $parentId, cursor: $cursor, limit: $limit) {\n      items {\n        id\n        text\n        parentId\n        postId\n        depth\n        gifUrl\n        gifAlt\n        replyCount\n        reactionSummary {\n          emoji\n          count\n          userReacted\n        }\n        createdAt\n        updatedAt\n        author {\n          id\n          name\n          avatarUrl\n          role\n        }\n      }\n      nextCursor\n    }\n  }\n": types.GetRepliesDocument,
    "\n  query GetAdminDashboard {\n    adminDashboard {\n      totalUsers\n      totalGroups\n      publishedPostsThisMonth\n      publishedPostsLastMonth\n      globalAttendanceRateThisWeek\n      globalAttendanceRateLastWeek\n      usersByRole {\n        admin\n        teacher\n        student\n      }\n      postsByStatus {\n        published\n        draft\n        pending\n        rejected\n      }\n      attendanceTrend {\n        date\n        rate\n      }\n    }\n  }\n": types.GetAdminDashboardDocument,
    "\n  query GetTeacherDashboard {\n    teacherDashboard {\n      myGroupCount\n      myGroupsTodayRate\n      myPostCount\n      pendingAttendanceCount\n      myGroupAttendanceTrend {\n        groupId\n        groupName\n        points {\n          date\n          rate\n        }\n      }\n      myPostsByStatus {\n        published\n        draft\n        pending\n        rejected\n      }\n    }\n  }\n": types.GetTeacherDashboardDocument,
    "\n  query GetStudentDashboard {\n    studentDashboard {\n      myAttendanceRate\n      myCurrentStreak\n      myDraftCount\n      myGroupMembershipCount\n      myAttendanceTrend {\n        date\n        status\n      }\n    }\n  }\n": types.GetStudentDashboardDocument,
    "\n  query GetRecentActivity($limit: Int) {\n    recentActivity(limit: $limit) {\n      id\n      type\n      description\n      actorName\n      actorAvatarUrl\n      actorRole\n      entityId\n      entityType\n      createdAt\n    }\n  }\n": types.GetRecentActivityDocument,
    "\n  query GetUsers($filters: UserFiltersInput) {\n    getUsers(filters: $filters) {\n      id\n      name\n      email\n      role\n      avatarUrl\n      createdAt\n      groups {\n        id\n        name\n      }\n    }\n  }\n": types.GetUsersDocument,
    "\n  query GetUser($id: ID!) {\n    getUser(id: $id) {\n      id\n      name\n      email\n      role\n      avatarUrl\n      createdAt\n      groups {\n        id\n        name\n      }\n    }\n  }\n": types.GetUserDocument,
    "\n  query GetGroups($filters: GroupFiltersInput) {\n    getGroups(filters: $filters) {\n      id\n      name\n      description\n      memberCount\n      createdBy\n      createdAt\n    }\n  }\n": types.GetGroupsDocument,
    "\n  query GetGroup($id: ID!) {\n    getGroup(id: $id) {\n      id\n      name\n      description\n      memberCount\n      createdBy\n      createdAt\n      members {\n        id\n        name\n        email\n        role\n        avatarUrl\n        joinedAt\n      }\n    }\n  }\n": types.GetGroupDocument,
    "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      id\n      name\n      email\n      role\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      id\n      name\n      email\n      role\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation DeleteUser($id: ID!) {\n    deleteUser(id: $id)\n  }\n": types.DeleteUserDocument,
    "\n  mutation BulkDeleteUsers($input: BulkDeleteUsersInput!) {\n    bulkDeleteUsers(input: $input)\n  }\n": types.BulkDeleteUsersDocument,
    "\n  mutation BulkUpdateUsers($input: BulkUpdateUsersInput!) {\n    bulkUpdateUsers(input: $input)\n  }\n": types.BulkUpdateUsersDocument,
    "\n  mutation ImportUsers($input: ImportUsersInput!) {\n    importUsers(input: $input) {\n      created\n      skipped\n      errors\n    }\n  }\n": types.ImportUsersDocument,
    "\n  mutation CreateGroup($input: CreateGroupInput!) {\n    createGroup(input: $input) {\n      id\n      name\n      description\n    }\n  }\n": types.CreateGroupDocument,
    "\n  mutation UpdateGroup($id: ID!, $input: UpdateGroupInput!) {\n    updateGroup(id: $id, input: $input) {\n      id\n      name\n      description\n    }\n  }\n": types.UpdateGroupDocument,
    "\n  mutation DeleteGroup($id: ID!) {\n    deleteGroup(id: $id)\n  }\n": types.DeleteGroupDocument,
    "\n  mutation AddMemberToGroup($groupId: ID!, $userId: ID!) {\n    addMemberToGroup(groupId: $groupId, userId: $userId)\n  }\n": types.AddMemberToGroupDocument,
    "\n  mutation RemoveMemberFromGroup($groupId: ID!, $userId: ID!) {\n    removeMemberFromGroup(groupId: $groupId, userId: $userId)\n  }\n": types.RemoveMemberFromGroupDocument,
    "\n  mutation CreateNote($input: CreateNoteInput!) {\n    createNote(input: $input) {\n      id\n      content\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateNoteDocument,
    "\n  mutation UpdateNote($input: UpdateNoteInput!) {\n    updateNote(input: $input) {\n      id\n      content\n      updatedAt\n    }\n  }\n": types.UpdateNoteDocument,
    "\n  mutation DeleteNote($input: DeleteNoteInput!) {\n    deleteNote(input: $input)\n  }\n": types.DeleteNoteDocument,
    "\n  query GetNotes {\n    notes {\n      id\n      content\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetNotesDocument,
    "\n  mutation CreateTaskItem($input: CreateTaskItemInput!) {\n    createTaskItem(input: $input) {\n      id\n      text\n      completed\n      order\n    }\n  }\n": types.CreateTaskItemDocument,
    "\n  mutation UpdateTaskItem($input: UpdateTaskItemInput!) {\n    updateTaskItem(input: $input) {\n      id\n      text\n      completed\n    }\n  }\n": types.UpdateTaskItemDocument,
    "\n  mutation DeleteTaskItem($input: DeleteTaskItemInput!) {\n    deleteTaskItem(input: $input)\n  }\n": types.DeleteTaskItemDocument,
    "\n  mutation ReorderTaskItems($input: ReorderTaskItemsInput!) {\n    reorderTaskItems(input: $input)\n  }\n": types.ReorderTaskItemsDocument,
    "\n  query GetTaskItems {\n    taskItems {\n      id\n      text\n      completed\n      order\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetTaskItemsDocument,
    "\n  query GetTools {\n    tools {\n      id\n      name\n      slug\n      description\n      icon\n      color\n      category {\n        id\n        name\n        slug\n        order\n      }\n    }\n  }\n": types.GetToolsDocument,
    "\n  mutation CreateRecording($input: CreateRecordingInput!) {\n    createRecording(input: $input) {\n      id\n      name\n      transcriptionStatus\n    }\n  }\n": types.CreateRecordingDocument,
    "\n  mutation DeleteRecording($input: DeleteRecordingInput!) {\n    deleteRecording(input: $input)\n  }\n": types.DeleteRecordingDocument,
    "\n  query GetSummaryPrompt {\n    getSummaryPrompt\n  }\n": types.GetSummaryPromptDocument,
    "\n  mutation UpdateSummaryPrompt($input: UpdateSummaryPromptInput!) {\n    updateSummaryPrompt(input: $input)\n  }\n": types.UpdateSummaryPromptDocument,
    "\n  query GetRecording($input: GetRecordingInput!) {\n    getRecording(input: $input) {\n      id\n      name\n      duration\n      audioUrl\n      transcriptionStatus\n      createdAt\n      transcription {\n        status\n        summaryStatus\n        summaryError\n        fullTranscript\n        segments\n        summary\n        keyTakeaways\n        actionItems\n        completedAt\n      }\n    }\n  }\n": types.GetRecordingDocument,
    "\n  query GetRecordings {\n    getRecordings {\n      id\n      name\n      duration\n      audioUrl\n      transcriptionStatus\n      createdAt\n    }\n  }\n": types.GetRecordingsDocument,
    "\n  mutation UpdateTranscription($input: UpdateTranscriptionInput!) {\n    updateTranscription(input: $input)\n  }\n": types.UpdateTranscriptionDocument,
    "\n  mutation GenerateSummary($input: GenerateSummaryInput!) {\n    generateSummary(input: $input)\n  }\n": types.GenerateSummaryDocument,
    "\n  query GetAITokenUsage {\n    getAITokenUsage {\n      groq {\n        remaining\n        limit\n        percentRemaining\n      }\n      gemini {\n        usedToday\n        dailyLimit\n        percentRemaining\n      }\n    }\n  }\n": types.GetAiTokenUsageDocument,
    "\n  query GetRecordingDetail($input: GetRecordingInput!) {\n    getRecording(input: $input) {\n      id\n      name\n      duration\n      audioUrl\n      transcriptionStatus\n      createdAt\n      transcription {\n        status\n        summaryStatus\n        summaryError\n        fullTranscript\n        segments\n        summary\n        keyTakeaways\n        actionItems\n        completedAt\n      }\n    }\n  }\n": types.GetRecordingDetailDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RecordAttendance($input: RecordAttendanceInput!) {\n    recordAttendance(input: $input)\n  }\n"): (typeof documents)["\n  mutation RecordAttendance($input: RecordAttendanceInput!) {\n    recordAttendance(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ExportAttendance($input: ExportAttendanceInput!) {\n    exportAttendance(input: $input) {\n      jobId\n    }\n  }\n"): (typeof documents)["\n  mutation ExportAttendance($input: ExportAttendanceInput!) {\n    exportAttendance(input: $input) {\n      jobId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAttendanceGroups {\n    attendanceGroups {\n      id\n      name\n      memberCount\n      todayRate\n      todaySubmitted\n    }\n  }\n"): (typeof documents)["\n  query GetAttendanceGroups {\n    attendanceGroups {\n      id\n      name\n      memberCount\n      todayRate\n      todaySubmitted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAttendanceRoster($groupId: String!, $date: String!) {\n    attendanceRoster(groupId: $groupId, date: $date) {\n      group {\n        id\n        name\n        memberCount\n        todayRate\n        todaySubmitted\n      }\n      date\n      roster {\n        id\n        name\n        avatarUrl\n        status\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAttendanceRoster($groupId: String!, $date: String!) {\n    attendanceRoster(groupId: $groupId, date: $date) {\n      group {\n        id\n        name\n        memberCount\n        todayRate\n        todaySubmitted\n      }\n      date\n      roster {\n        id\n        name\n        avatarUrl\n        status\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAttendanceReport($groupId: String!, $period: ReportPeriod!, $date: String) {\n    attendanceReport(groupId: $groupId, period: $period, date: $date) {\n      studentId\n      studentName\n      attendanceRate\n      presentCount\n      absentCount\n      lateCount\n      excusedCount\n      totalDays\n    }\n  }\n"): (typeof documents)["\n  query GetAttendanceReport($groupId: String!, $period: ReportPeriod!, $date: String) {\n    attendanceReport(groupId: $groupId, period: $period, date: $date) {\n      studentId\n      studentName\n      attendanceRate\n      presentCount\n      absentCount\n      lateCount\n      excusedCount\n      totalDays\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetStudentAttendanceHistory {\n    studentAttendanceHistory {\n      id\n      date\n      groupName\n      status\n    }\n  }\n"): (typeof documents)["\n  query GetStudentAttendanceHistory {\n    studentAttendanceHistory {\n      id\n      date\n      groupName\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetStudentAttendanceSummary {\n    studentAttendanceSummary {\n      overallRate\n      currentStreak\n      groupCount\n    }\n  }\n"): (typeof documents)["\n  query GetStudentAttendanceSummary {\n    studentAttendanceSummary {\n      overallRate\n      currentStreak\n      groupCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetExportStatus($jobId: String!) {\n    attendanceExportStatus(jobId: $jobId) {\n      jobId\n      status\n      downloadUrl\n    }\n  }\n"): (typeof documents)["\n  query GetExportStatus($jobId: String!) {\n    attendanceExportStatus(jobId: $jobId) {\n      jobId\n      status\n      downloadUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AttendanceReportByRange($input: AttendanceReportByRangeInput!) {\n    attendanceReportByRange(input: $input) {\n      groupId\n      groupName\n      dateFrom\n      dateTo\n      summary {\n        totalStudents\n        averageRate\n        totalPresent\n        totalAbsent\n        totalLate\n        totalExcused\n        totalSessions\n      }\n      students {\n        studentId\n        studentName\n        attendanceRate\n        presentCount\n        absentCount\n        lateCount\n        excusedCount\n        totalDays\n      }\n    }\n  }\n"): (typeof documents)["\n  query AttendanceReportByRange($input: AttendanceReportByRangeInput!) {\n    attendanceReportByRange(input: $input) {\n      groupId\n      groupName\n      dateFrom\n      dateTo\n      summary {\n        totalStudents\n        averageRate\n        totalPresent\n        totalAbsent\n        totalLate\n        totalExcused\n        totalSessions\n      }\n      students {\n        studentId\n        studentName\n        attendanceRate\n        presentCount\n        absentCount\n        lateCount\n        excusedCount\n        totalDays\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RefreshToken($input: RefreshTokenInput!) {\n    refreshToken(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation RefreshToken($input: RefreshTokenInput!) {\n    refreshToken(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      email\n      name\n      role\n      avatarUrl\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      name\n      role\n      avatarUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestLoginCode($input: RequestLoginCodeInput!) {\n    requestLoginCode(input: $input)\n  }\n"): (typeof documents)["\n  mutation RequestLoginCode($input: RequestLoginCodeInput!) {\n    requestLoginCode(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LoginWithCode($input: LoginWithCodeInput!) {\n    loginWithCode(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation LoginWithCode($input: LoginWithCodeInput!) {\n    loginWithCode(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {\n    updatePost(id: $id, input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {\n    updatePost(id: $id, input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePost($id: ID!) {\n    deletePost(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeletePost($id: ID!) {\n    deletePost(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReviewDraft($id: ID!, $input: ReviewDraftInput!) {\n    reviewDraft(id: $id, input: $input) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation ReviewDraft($id: ID!, $input: ReviewDraftInput!) {\n    reviewDraft(id: $id, input: $input) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ToggleReaction($postId: ID, $commentId: ID, $emoji: String) {\n    toggleReaction(postId: $postId, commentId: $commentId, emoji: $emoji) {\n      emoji\n      count\n      userReacted\n    }\n  }\n"): (typeof documents)["\n  mutation ToggleReaction($postId: ID, $commentId: ID, $emoji: String) {\n    toggleReaction(postId: $postId, commentId: $commentId, emoji: $emoji) {\n      emoji\n      count\n      userReacted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddComment($input: AddCommentInput!) {\n    addComment(input: $input) {\n      id\n      text\n      parentId\n      depth\n      gifUrl\n      gifAlt\n      createdAt\n      author {\n        id\n        name\n        avatarUrl\n        role\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddComment($input: AddCommentInput!) {\n    addComment(input: $input) {\n      id\n      text\n      parentId\n      depth\n      gifUrl\n      gifAlt\n      createdAt\n      author {\n        id\n        name\n        avatarUrl\n        role\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateComment($id: ID!, $text: String!) {\n    updateComment(id: $id, text: $text) {\n      id\n      text\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateComment($id: ID!, $text: String!) {\n    updateComment(id: $id, text: $text) {\n      id\n      text\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteComment($id: ID!) {\n    deleteComment(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteComment($id: ID!) {\n    deleteComment(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCategory($name: String!) {\n    createCategory(name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategory($name: String!) {\n    createCategory(name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCategory($id: ID!, $name: String!) {\n    updateCategory(id: $id, name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCategory($id: ID!, $name: String!) {\n    updateCategory(id: $id, name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPosts($filters: PostFiltersInput) {\n    posts(filters: $filters) {\n      id\n      title\n      excerpt\n      status\n      createdAt\n      author {\n        id\n        name\n        avatarUrl\n        role\n      }\n      categories {\n        id\n        name\n      }\n      reactionSummary {\n        emoji\n        count\n        userReacted\n      }\n      commentCount\n    }\n  }\n"): (typeof documents)["\n  query GetPosts($filters: PostFiltersInput) {\n    posts(filters: $filters) {\n      id\n      title\n      excerpt\n      status\n      createdAt\n      author {\n        id\n        name\n        avatarUrl\n        role\n      }\n      categories {\n        id\n        name\n      }\n      reactionSummary {\n        emoji\n        count\n        userReacted\n      }\n      commentCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPostById($id: ID!) {\n    post(id: $id) {\n      id\n      title\n      excerpt\n      content\n      status\n      createdAt\n      updatedAt\n      rejectionNote\n      publishedAt\n      author {\n        id\n        name\n        avatarUrl\n        role\n      }\n      categories {\n        id\n        name\n      }\n      reactionSummary {\n        emoji\n        count\n        userReacted\n      }\n      images {\n        id\n        url\n        publicId\n        order\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPostById($id: ID!) {\n    post(id: $id) {\n      id\n      title\n      excerpt\n      content\n      status\n      createdAt\n      updatedAt\n      rejectionNote\n      publishedAt\n      author {\n        id\n        name\n        avatarUrl\n        role\n      }\n      categories {\n        id\n        name\n      }\n      reactionSummary {\n        emoji\n        count\n        userReacted\n      }\n      images {\n        id\n        url\n        publicId\n        order\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCategories {\n    categories {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetCategories {\n    categories {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDraftQueue {\n    draftQueue {\n      id\n      title\n      excerpt\n      createdAt\n      author {\n        id\n        name\n        avatarUrl\n      }\n      categories {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetDraftQueue {\n    draftQueue {\n      id\n      title\n      excerpt\n      createdAt\n      author {\n        id\n        name\n        avatarUrl\n      }\n      categories {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMyDrafts {\n    myDrafts {\n      id\n      title\n      status\n      rejectionNote\n      createdAt\n      updatedAt\n      categories {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMyDrafts {\n    myDrafts {\n      id\n      title\n      status\n      rejectionNote\n      createdAt\n      updatedAt\n      categories {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFeed($filters: PostFiltersInput, $cursor: String, $limit: Int) {\n    feed(filters: $filters, cursor: $cursor, limit: $limit) {\n      items {\n        id\n        title\n        excerpt\n        status\n        createdAt\n        publishedAt\n        authorId\n        author {\n          id\n          name\n          avatarUrl\n          role\n        }\n        categories {\n          id\n          name\n        }\n        reactionSummary {\n          emoji\n          count\n          userReacted\n        }\n        commentCount\n        images {\n          id\n          url\n          publicId\n          order\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  query GetFeed($filters: PostFiltersInput, $cursor: String, $limit: Int) {\n    feed(filters: $filters, cursor: $cursor, limit: $limit) {\n      items {\n        id\n        title\n        excerpt\n        status\n        createdAt\n        publishedAt\n        authorId\n        author {\n          id\n          name\n          avatarUrl\n          role\n        }\n        categories {\n          id\n          name\n        }\n        reactionSummary {\n          emoji\n          count\n          userReacted\n        }\n        commentCount\n        images {\n          id\n          url\n          publicId\n          order\n        }\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetComments($postId: ID!, $cursor: String, $limit: Int) {\n    comments(postId: $postId, cursor: $cursor, limit: $limit) {\n      items {\n        id\n        text\n        parentId\n        postId\n        depth\n        gifUrl\n        gifAlt\n        replyCount\n        reactionSummary {\n          emoji\n          count\n          userReacted\n        }\n        createdAt\n        updatedAt\n        author {\n          id\n          name\n          avatarUrl\n          role\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  query GetComments($postId: ID!, $cursor: String, $limit: Int) {\n    comments(postId: $postId, cursor: $cursor, limit: $limit) {\n      items {\n        id\n        text\n        parentId\n        postId\n        depth\n        gifUrl\n        gifAlt\n        replyCount\n        reactionSummary {\n          emoji\n          count\n          userReacted\n        }\n        createdAt\n        updatedAt\n        author {\n          id\n          name\n          avatarUrl\n          role\n        }\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetReplies($parentId: ID!, $cursor: String, $limit: Int) {\n    replies(parentId: $parentId, cursor: $cursor, limit: $limit) {\n      items {\n        id\n        text\n        parentId\n        postId\n        depth\n        gifUrl\n        gifAlt\n        replyCount\n        reactionSummary {\n          emoji\n          count\n          userReacted\n        }\n        createdAt\n        updatedAt\n        author {\n          id\n          name\n          avatarUrl\n          role\n        }\n      }\n      nextCursor\n    }\n  }\n"): (typeof documents)["\n  query GetReplies($parentId: ID!, $cursor: String, $limit: Int) {\n    replies(parentId: $parentId, cursor: $cursor, limit: $limit) {\n      items {\n        id\n        text\n        parentId\n        postId\n        depth\n        gifUrl\n        gifAlt\n        replyCount\n        reactionSummary {\n          emoji\n          count\n          userReacted\n        }\n        createdAt\n        updatedAt\n        author {\n          id\n          name\n          avatarUrl\n          role\n        }\n      }\n      nextCursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAdminDashboard {\n    adminDashboard {\n      totalUsers\n      totalGroups\n      publishedPostsThisMonth\n      publishedPostsLastMonth\n      globalAttendanceRateThisWeek\n      globalAttendanceRateLastWeek\n      usersByRole {\n        admin\n        teacher\n        student\n      }\n      postsByStatus {\n        published\n        draft\n        pending\n        rejected\n      }\n      attendanceTrend {\n        date\n        rate\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAdminDashboard {\n    adminDashboard {\n      totalUsers\n      totalGroups\n      publishedPostsThisMonth\n      publishedPostsLastMonth\n      globalAttendanceRateThisWeek\n      globalAttendanceRateLastWeek\n      usersByRole {\n        admin\n        teacher\n        student\n      }\n      postsByStatus {\n        published\n        draft\n        pending\n        rejected\n      }\n      attendanceTrend {\n        date\n        rate\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetTeacherDashboard {\n    teacherDashboard {\n      myGroupCount\n      myGroupsTodayRate\n      myPostCount\n      pendingAttendanceCount\n      myGroupAttendanceTrend {\n        groupId\n        groupName\n        points {\n          date\n          rate\n        }\n      }\n      myPostsByStatus {\n        published\n        draft\n        pending\n        rejected\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetTeacherDashboard {\n    teacherDashboard {\n      myGroupCount\n      myGroupsTodayRate\n      myPostCount\n      pendingAttendanceCount\n      myGroupAttendanceTrend {\n        groupId\n        groupName\n        points {\n          date\n          rate\n        }\n      }\n      myPostsByStatus {\n        published\n        draft\n        pending\n        rejected\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetStudentDashboard {\n    studentDashboard {\n      myAttendanceRate\n      myCurrentStreak\n      myDraftCount\n      myGroupMembershipCount\n      myAttendanceTrend {\n        date\n        status\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetStudentDashboard {\n    studentDashboard {\n      myAttendanceRate\n      myCurrentStreak\n      myDraftCount\n      myGroupMembershipCount\n      myAttendanceTrend {\n        date\n        status\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRecentActivity($limit: Int) {\n    recentActivity(limit: $limit) {\n      id\n      type\n      description\n      actorName\n      actorAvatarUrl\n      actorRole\n      entityId\n      entityType\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetRecentActivity($limit: Int) {\n    recentActivity(limit: $limit) {\n      id\n      type\n      description\n      actorName\n      actorAvatarUrl\n      actorRole\n      entityId\n      entityType\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers($filters: UserFiltersInput) {\n    getUsers(filters: $filters) {\n      id\n      name\n      email\n      role\n      avatarUrl\n      createdAt\n      groups {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUsers($filters: UserFiltersInput) {\n    getUsers(filters: $filters) {\n      id\n      name\n      email\n      role\n      avatarUrl\n      createdAt\n      groups {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUser($id: ID!) {\n    getUser(id: $id) {\n      id\n      name\n      email\n      role\n      avatarUrl\n      createdAt\n      groups {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUser($id: ID!) {\n    getUser(id: $id) {\n      id\n      name\n      email\n      role\n      avatarUrl\n      createdAt\n      groups {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGroups($filters: GroupFiltersInput) {\n    getGroups(filters: $filters) {\n      id\n      name\n      description\n      memberCount\n      createdBy\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetGroups($filters: GroupFiltersInput) {\n    getGroups(filters: $filters) {\n      id\n      name\n      description\n      memberCount\n      createdBy\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGroup($id: ID!) {\n    getGroup(id: $id) {\n      id\n      name\n      description\n      memberCount\n      createdBy\n      createdAt\n      members {\n        id\n        name\n        email\n        role\n        avatarUrl\n        joinedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetGroup($id: ID!) {\n    getGroup(id: $id) {\n      id\n      name\n      description\n      memberCount\n      createdBy\n      createdAt\n      members {\n        id\n        name\n        email\n        role\n        avatarUrl\n        joinedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      id\n      name\n      email\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      id\n      name\n      email\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      id\n      name\n      email\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      id\n      name\n      email\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteUser($id: ID!) {\n    deleteUser(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteUser($id: ID!) {\n    deleteUser(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation BulkDeleteUsers($input: BulkDeleteUsersInput!) {\n    bulkDeleteUsers(input: $input)\n  }\n"): (typeof documents)["\n  mutation BulkDeleteUsers($input: BulkDeleteUsersInput!) {\n    bulkDeleteUsers(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation BulkUpdateUsers($input: BulkUpdateUsersInput!) {\n    bulkUpdateUsers(input: $input)\n  }\n"): (typeof documents)["\n  mutation BulkUpdateUsers($input: BulkUpdateUsersInput!) {\n    bulkUpdateUsers(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ImportUsers($input: ImportUsersInput!) {\n    importUsers(input: $input) {\n      created\n      skipped\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation ImportUsers($input: ImportUsersInput!) {\n    importUsers(input: $input) {\n      created\n      skipped\n      errors\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateGroup($input: CreateGroupInput!) {\n    createGroup(input: $input) {\n      id\n      name\n      description\n    }\n  }\n"): (typeof documents)["\n  mutation CreateGroup($input: CreateGroupInput!) {\n    createGroup(input: $input) {\n      id\n      name\n      description\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateGroup($id: ID!, $input: UpdateGroupInput!) {\n    updateGroup(id: $id, input: $input) {\n      id\n      name\n      description\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateGroup($id: ID!, $input: UpdateGroupInput!) {\n    updateGroup(id: $id, input: $input) {\n      id\n      name\n      description\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteGroup($id: ID!) {\n    deleteGroup(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteGroup($id: ID!) {\n    deleteGroup(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddMemberToGroup($groupId: ID!, $userId: ID!) {\n    addMemberToGroup(groupId: $groupId, userId: $userId)\n  }\n"): (typeof documents)["\n  mutation AddMemberToGroup($groupId: ID!, $userId: ID!) {\n    addMemberToGroup(groupId: $groupId, userId: $userId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveMemberFromGroup($groupId: ID!, $userId: ID!) {\n    removeMemberFromGroup(groupId: $groupId, userId: $userId)\n  }\n"): (typeof documents)["\n  mutation RemoveMemberFromGroup($groupId: ID!, $userId: ID!) {\n    removeMemberFromGroup(groupId: $groupId, userId: $userId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateNote($input: CreateNoteInput!) {\n    createNote(input: $input) {\n      id\n      content\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateNote($input: CreateNoteInput!) {\n    createNote(input: $input) {\n      id\n      content\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateNote($input: UpdateNoteInput!) {\n    updateNote(input: $input) {\n      id\n      content\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateNote($input: UpdateNoteInput!) {\n    updateNote(input: $input) {\n      id\n      content\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteNote($input: DeleteNoteInput!) {\n    deleteNote(input: $input)\n  }\n"): (typeof documents)["\n  mutation DeleteNote($input: DeleteNoteInput!) {\n    deleteNote(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetNotes {\n    notes {\n      id\n      content\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetNotes {\n    notes {\n      id\n      content\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTaskItem($input: CreateTaskItemInput!) {\n    createTaskItem(input: $input) {\n      id\n      text\n      completed\n      order\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTaskItem($input: CreateTaskItemInput!) {\n    createTaskItem(input: $input) {\n      id\n      text\n      completed\n      order\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTaskItem($input: UpdateTaskItemInput!) {\n    updateTaskItem(input: $input) {\n      id\n      text\n      completed\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTaskItem($input: UpdateTaskItemInput!) {\n    updateTaskItem(input: $input) {\n      id\n      text\n      completed\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTaskItem($input: DeleteTaskItemInput!) {\n    deleteTaskItem(input: $input)\n  }\n"): (typeof documents)["\n  mutation DeleteTaskItem($input: DeleteTaskItemInput!) {\n    deleteTaskItem(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderTaskItems($input: ReorderTaskItemsInput!) {\n    reorderTaskItems(input: $input)\n  }\n"): (typeof documents)["\n  mutation ReorderTaskItems($input: ReorderTaskItemsInput!) {\n    reorderTaskItems(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetTaskItems {\n    taskItems {\n      id\n      text\n      completed\n      order\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetTaskItems {\n    taskItems {\n      id\n      text\n      completed\n      order\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetTools {\n    tools {\n      id\n      name\n      slug\n      description\n      icon\n      color\n      category {\n        id\n        name\n        slug\n        order\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetTools {\n    tools {\n      id\n      name\n      slug\n      description\n      icon\n      color\n      category {\n        id\n        name\n        slug\n        order\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateRecording($input: CreateRecordingInput!) {\n    createRecording(input: $input) {\n      id\n      name\n      transcriptionStatus\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRecording($input: CreateRecordingInput!) {\n    createRecording(input: $input) {\n      id\n      name\n      transcriptionStatus\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteRecording($input: DeleteRecordingInput!) {\n    deleteRecording(input: $input)\n  }\n"): (typeof documents)["\n  mutation DeleteRecording($input: DeleteRecordingInput!) {\n    deleteRecording(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSummaryPrompt {\n    getSummaryPrompt\n  }\n"): (typeof documents)["\n  query GetSummaryPrompt {\n    getSummaryPrompt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateSummaryPrompt($input: UpdateSummaryPromptInput!) {\n    updateSummaryPrompt(input: $input)\n  }\n"): (typeof documents)["\n  mutation UpdateSummaryPrompt($input: UpdateSummaryPromptInput!) {\n    updateSummaryPrompt(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRecording($input: GetRecordingInput!) {\n    getRecording(input: $input) {\n      id\n      name\n      duration\n      audioUrl\n      transcriptionStatus\n      createdAt\n      transcription {\n        status\n        summaryStatus\n        summaryError\n        fullTranscript\n        segments\n        summary\n        keyTakeaways\n        actionItems\n        completedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRecording($input: GetRecordingInput!) {\n    getRecording(input: $input) {\n      id\n      name\n      duration\n      audioUrl\n      transcriptionStatus\n      createdAt\n      transcription {\n        status\n        summaryStatus\n        summaryError\n        fullTranscript\n        segments\n        summary\n        keyTakeaways\n        actionItems\n        completedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRecordings {\n    getRecordings {\n      id\n      name\n      duration\n      audioUrl\n      transcriptionStatus\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetRecordings {\n    getRecordings {\n      id\n      name\n      duration\n      audioUrl\n      transcriptionStatus\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTranscription($input: UpdateTranscriptionInput!) {\n    updateTranscription(input: $input)\n  }\n"): (typeof documents)["\n  mutation UpdateTranscription($input: UpdateTranscriptionInput!) {\n    updateTranscription(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GenerateSummary($input: GenerateSummaryInput!) {\n    generateSummary(input: $input)\n  }\n"): (typeof documents)["\n  mutation GenerateSummary($input: GenerateSummaryInput!) {\n    generateSummary(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAITokenUsage {\n    getAITokenUsage {\n      groq {\n        remaining\n        limit\n        percentRemaining\n      }\n      gemini {\n        usedToday\n        dailyLimit\n        percentRemaining\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAITokenUsage {\n    getAITokenUsage {\n      groq {\n        remaining\n        limit\n        percentRemaining\n      }\n      gemini {\n        usedToday\n        dailyLimit\n        percentRemaining\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRecordingDetail($input: GetRecordingInput!) {\n    getRecording(input: $input) {\n      id\n      name\n      duration\n      audioUrl\n      transcriptionStatus\n      createdAt\n      transcription {\n        status\n        summaryStatus\n        summaryError\n        fullTranscript\n        segments\n        summary\n        keyTakeaways\n        actionItems\n        completedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRecordingDetail($input: GetRecordingInput!) {\n    getRecording(input: $input) {\n      id\n      name\n      duration\n      audioUrl\n      transcriptionStatus\n      createdAt\n      transcription {\n        status\n        summaryStatus\n        summaryError\n        fullTranscript\n        segments\n        summary\n        keyTakeaways\n        actionItems\n        completedAt\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;