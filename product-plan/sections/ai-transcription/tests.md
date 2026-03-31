# AI Transcription Tests

## Overview

Tests verify that the AI Transcription section renders the recordings list with folder filtering, handles the recording and upload flows, displays the recording detail with audio player, manages AI transcription triggering and result tabs, handles folder CRUD operations, and fires all callbacks with the correct arguments.

---

## User Flow Tests

### Flow 1: User records audio and saves it

**Success Path**

1. Render `AITranscriptionView` with 3 recordings and 2 folders
2. - [ ] The recordings list displays 3 `RecordingCard` components
3. - [ ] Each card shows: name, folder badge, duration (formatted as mm:ss), date, and transcription status
4. - [ ] The folder sidebar shows "All" (selected by default), "Juntas de Personal" (2), and "Grabaciones de Clase" (1)
5. - [ ] "Record" and "Upload" buttons are visible
6. Click the "Record" button
7. - [ ] `onStartRecording` is called
8. Re-render with `recorder` data in `recording` state
9. - [ ] The recorder overlay opens showing a waveform visualization area, elapsed time (00:00), remaining time (30:00), volume meter, and "Pause" and "Stop" buttons
10. The elapsed time counts up as recording progresses
11. - [ ] Elapsed time updates (e.g., "02:15")
12. - [ ] Remaining time counts down (e.g., "27:45")
13. Click "Pause"
14. - [ ] `onRecorderPause` is called
15. - [ ] The button changes to "Resume"
16. Click "Resume"
17. - [ ] `onRecorderResume` is called
18. Click "Stop"
19. - [ ] `onRecorderStop` is called
20. - [ ] A save dialog appears with a name input and folder selector
21. Enter name "Staff Meeting March 28" and select folder "Juntas de Personal"
22. Click "Save"
23. - [ ] `onSave` is called with `("Staff Meeting March 28", "folder-1")`

**Failure Path**

1. Open the recorder and click "Cancel" before stopping
2. - [ ] `onRecorderCancel` is called
3. - [ ] The recorder overlay closes without saving
4. Try to save a recording with an empty name
5. - [ ] A validation error is shown (e.g., "Recording name is required")
6. - [ ] `onSave` is NOT called

### Flow 2: User uploads an audio file

**Success Path**

1. Click the "Upload" button
2. - [ ] `onUpload` is called
3. - [ ] A file picker opens accepting MP3, WAV, and M4A formats
4. After file selection, the save dialog appears
5. Enter a name and select a folder, then click "Save"
6. - [ ] `onSave` is called with the name and folder ID

**Failure Path**

1. User selects a file with an unsupported format (e.g., .txt)
2. - [ ] The file picker rejects the file or an error message is shown
3. - [ ] No save dialog appears

### Flow 3: User transcribes a recording and views results

**Success Path**

1. Click on a recording card with `transcriptionStatus: "none"`
2. - [ ] `onRecordingClick` is called with the recording's ID
3. Re-render with `selectedDetail` containing the recording (no transcription)
4. - [ ] The detail view shows: recording name, folder name, duration, creation date, and an audio player with play/pause and scrub bar
5. - [ ] A prominent "Transcribe" button is visible
6. - [ ] No transcription tabs are shown
7. Click "Transcribe"
8. - [ ] `onTranscribe` is called with the recording's ID
9. Re-render with `transcriptionStatus: "processing"`
10. - [ ] A loading/processing state is shown (skeleton or spinner with "Transcribing..." message)
11. - [ ] The "Transcribe" button is disabled or hidden
12. Re-render with `transcriptionStatus: "completed"` and `transcription` data
13. - [ ] Four tabs appear: "Transcript", "Summary", "Takeaways", "Action Items"
14. - [ ] The "Transcript" tab is active by default, showing the full transcript text
15. Click the "Summary" tab
16. - [ ] The summary text is displayed
17. Click the "Takeaways" tab
18. - [ ] A bulleted list of key takeaways is displayed
19. Click the "Action Items" tab
20. - [ ] A checklist-style list of action items is displayed (visual only, not interactive)
21. Click "Back" to return to the recordings list
22. - [ ] `onBack` is called

**Failure Path**

1. Open a recording that is currently in `processing` state
2. - [ ] The processing indicator is shown
3. - [ ] The "Transcribe" button is not available
4. - [ ] Transcription tabs are not yet shown

### Flow 4: User manages folders and organizes recordings

**Success Path**

1. Click "Create Folder" in the folder sidebar
2. - [ ] A name input appears
3. Enter "Reuniones Academicas" and confirm
4. - [ ] `onCreateFolder` is called with `"Reuniones Academicas"`
5. Right-click or use the menu on an existing folder
6. - [ ] "Rename" and "Delete" options are available
7. Click "Rename" on "Juntas de Personal"
8. - [ ] An editable name input appears with the current name pre-filled
9. Change to "Juntas del Personal" and confirm
10. - [ ] `onRenameFolder` is called with `("folder-1", "Juntas del Personal")`
11. Click "Delete" on an empty folder
12. - [ ] A confirmation dialog appears
13. Confirm deletion
14. - [ ] `onDeleteFolder` is called with the folder's ID
15. In the recording detail, click "Move" and select a different folder
16. - [ ] `onMove` is called with `(recordingId, newFolderId)`
17. Select a folder in the sidebar to filter
18. - [ ] `onFolderSelect` is called with the folder's ID
19. - [ ] Only recordings in that folder are displayed

**Failure Path**

1. Try to delete a folder that contains recordings
2. - [ ] A warning is shown (e.g., "This folder contains 3 recordings. Move or delete them first.")
3. - [ ] `onDeleteFolder` is NOT called unless confirmed

---

## Empty State Tests

- [ ] When `recordings` is empty, a friendly message is shown (e.g., "No recordings yet. Click Record or Upload to get started.")
- [ ] When a folder is empty (no recordings match the filter), a message is shown (e.g., "No recordings in this folder")
- [ ] When search returns no results, a message is shown (e.g., "No recordings match your search")
- [ ] When a recording has no transcription, the tab area shows a "Transcribe" CTA instead of tabs
- [ ] When `folders` is empty, the sidebar shows only "All" with a "Create Folder" option

---

## Component Interaction Tests

- [ ] `RecordingCard` transcription status indicators: "none" = gray/neutral, "processing" = animated/pulsing, "completed" = green checkmark
- [ ] Duration on `RecordingCard` is formatted as mm:ss (e.g., 125 seconds shows as "2:05")
- [ ] Folder sidebar highlights the currently selected folder
- [ ] "All" in the folder sidebar shows the total count of all recordings
- [ ] The audio player in the detail view has play/pause and a scrub bar with current time and total duration
- [ ] The recorder overlay covers the full screen and prevents interaction with the list behind it
- [ ] The volume meter in the recorder updates in real-time during recording
- [ ] Transcription result tabs preserve their content when switching between them
- [ ] The search bar filters recordings by name as the user types

---

## Edge Cases

- [ ] Recording that reaches the 30-minute limit auto-stops (triggers `onRecorderStop`)
- [ ] Recording with duration of exactly 0 seconds (immediately stopped) is handled gracefully
- [ ] Very long recording names truncate with ellipsis on the `RecordingCard`
- [ ] Very long transcription text (10,000+ words) renders without performance issues
- [ ] Action items list with 20+ items renders as a scrollable list
- [ ] Moving a recording to the currently selected folder filter updates the list correctly
- [ ] Deleting the currently viewed recording navigates back to the list
- [ ] Searching while a folder filter is active applies both filters (AND logic)
- [ ] Renaming a recording while viewing its detail updates the header immediately

---

## Accessibility Checks

- [ ] The audio player controls are keyboard-accessible (Space for play/pause, arrow keys for scrub)
- [ ] Recorder state is announced to screen readers (e.g., "Recording", "Paused", "Stopped")
- [ ] The elapsed time and remaining time are live regions (`aria-live="polite"`) during recording
- [ ] Transcription result tabs use proper `role="tablist"` and `role="tabpanel"` attributes
- [ ] Folder sidebar navigation is keyboard-accessible
- [ ] Recording cards are focusable and activatable with Enter
- [ ] The "Transcribe" button has a descriptive label (e.g., "Transcribe this recording with AI")
- [ ] Processing state communicates to screen readers (e.g., `aria-busy="true"`)
- [ ] Action items in the checklist have proper list semantics (`<ul>` / `<li>`)

---

## Sample Test Data

```typescript
import type {
  Recording,
  Folder,
  TranscriptionResult,
  RecordingDetail,
  RecorderData,
} from "./types";

const mockFolders: Folder[] = [
  { id: "folder-1", name: "Juntas de Personal", recordingCount: 2 },
  { id: "folder-2", name: "Grabaciones de Clase", recordingCount: 1 },
];

const mockRecordings: Recording[] = [
  {
    id: "rec-1",
    userId: "teacher-1",
    name: "Staff Meeting March 15",
    folderId: "folder-1",
    folderName: "Juntas de Personal",
    duration: 1245,
    createdAt: "2026-03-15T10:00:00Z",
    transcriptionStatus: "completed",
    audioUrl: "https://example.com/audio/rec-1.mp3",
  },
  {
    id: "rec-2",
    userId: "teacher-1",
    name: "Parent Conference Call",
    folderId: "folder-1",
    folderName: "Juntas de Personal",
    duration: 890,
    createdAt: "2026-03-20T14:30:00Z",
    transcriptionStatus: "none",
    audioUrl: "https://example.com/audio/rec-2.mp3",
  },
  {
    id: "rec-3",
    userId: "teacher-1",
    name: "Biology Lecture - Cells",
    folderId: "folder-2",
    folderName: "Grabaciones de Clase",
    duration: 1800,
    createdAt: "2026-03-25T09:00:00Z",
    transcriptionStatus: "processing",
    audioUrl: "https://example.com/audio/rec-3.mp3",
  },
];

const mockTranscription: TranscriptionResult = {
  fullTranscript:
    "Good morning everyone. Thank you for joining today's staff meeting. Let's start with attendance updates. As of this week, overall attendance across all groups is at 91 percent, which is a slight improvement from last month. Group 7A has shown the most improvement with a 5 percent increase...",
  summary:
    "Staff meeting covered attendance improvements (91% overall, Group 7A up 5%), upcoming science fair logistics, new blog moderation policy requiring teacher review of student drafts, and budget approval for new classroom technology equipment.",
  keyTakeaways: [
    "Overall attendance improved to 91%, with Group 7A showing the most improvement (+5%)",
    "Science fair scheduled for April 15 — all teachers must submit project lists by April 1",
    "New blog policy: all student drafts require teacher review before publication",
    "Budget of $5,000 approved for new tablets and audio equipment",
    "Next staff meeting moved to April 5 due to spring break schedule",
  ],
  actionItems: [
    "All teachers: Submit science fair project lists by April 1",
    "Prof. Lopez: Set up blog draft review workflow by March 30",
    "Admin Rodriguez: Order tablets and audio equipment by April 10",
    "Coach Garcia: Coordinate sports day volunteers for April 20",
    "All teachers: Update student attendance records for March by March 31",
  ],
  completedAt: "2026-03-15T10:25:00Z",
};

const mockRecordingDetail: RecordingDetail = {
  recording: mockRecordings[0],
  transcription: mockTranscription,
};

const mockRecordingDetailNoTranscription: RecordingDetail = {
  recording: mockRecordings[1],
  transcription: undefined,
};

const mockRecorderActive: RecorderData = {
  state: "recording",
  elapsedSeconds: 135,
  maxSeconds: 1800,
  volumeLevel: 65,
};

const mockRecorderPaused: RecorderData = {
  state: "paused",
  elapsedSeconds: 135,
  maxSeconds: 1800,
  volumeLevel: 0,
};

const mockRecorderIdle: RecorderData = {
  state: "idle",
  elapsedSeconds: 0,
  maxSeconds: 1800,
  volumeLevel: 0,
};
```
