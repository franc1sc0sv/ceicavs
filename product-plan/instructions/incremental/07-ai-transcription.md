# Milestone 7: AI Transcription

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

Build an audio recording and transcription module for admins and teachers. Users record audio via their microphone (30 minute max) or upload audio files, organize recordings into folders, and trigger AI-powered transcription that produces a full transcript, summary, key takeaways, and action items. All recordings and transcriptions are private per user. Students do not have access to this section.

## Overview

The AI Transcription section has three main views: (1) a recordings list with a folder sidebar for filtering and organizing, (2) a recording detail view with an audio player and transcription tabs, and (3) a recorder overlay for capturing new audio. Users can also upload existing audio files. The transcription is triggered manually per recording and displays results in four tabbed sections.

## Key Functionality

- **Recordings list**: card grid/list showing recording name, folder badge, duration, creation date, and transcription status (not transcribed / processing / transcribed)
- **Folder sidebar**: list of user-created folders with recording counts, "All" as the default filter, ability to create, rename, and delete folders
- **Search bar**: filters recordings by name above the list
- **New recording (recorder overlay)**: modal or full-screen overlay with live audio waveform visualization, elapsed time counter (mm:ss), remaining time countdown (30 min max = 1800 seconds), volume level meter, pause/resume button, stop button
- **Save dialog**: after recording or upload, a dialog with name input and folder selector
- **Upload**: file picker accepting MP3, WAV, M4A formats, then the same save dialog
- **Recording detail view**: header with recording name, folder, duration, and creation date; audio player with play/pause and scrub bar
- **Transcribe button**: prominent CTA shown when the recording has no transcription; fires `onTranscribe`
- **Processing state**: skeleton/spinner while AI transcription is running
- **Transcription tabs** (after completion):
  - **Transcript**: full text output (read-only)
  - **Summary**: concise executive summary
  - **Takeaways**: bulleted list of key points
  - **Action Items**: list of detected tasks/agreements (displayed as a visual checklist, not interactive)
- **Recording management**: rename, delete, and move recordings between folders
- **Privacy**: all recordings and transcriptions are private to the user who created them

## Components Provided

| File | Description |
|------|-------------|
| `sections/ai-transcription/components/AITranscriptionView.tsx` | Root component handling list, detail, and recorder views |
| `sections/ai-transcription/components/RecordingCard.tsx` | Single recording card with name, duration, status badge |
| `sections/ai-transcription/components/index.ts` | Barrel exports |

## Props Reference

### AITranscriptionProps (top-level)

| Prop | Type | Description |
|------|------|-------------|
| `recordings` | `Recording[]` | User's recordings list |
| `folders` | `Folder[]` | User's folders |
| `selectedFolderId` | `string \| null` | Active folder filter |
| `searchQuery` | `string` | Current search text |
| `selectedDetail` | `RecordingDetail` | Currently viewing recording (if detail open) |
| `recorder` | `RecorderData` | Recorder state (if recording in progress) |
| `onRecordingClick` | `(recordingId: string) => void` | Open recording detail |
| `onFolderSelect` | `(folderId: string \| null) => void` | Filter by folder (null = all) |
| `onSearch` | `(query: string) => void` | Search input change |
| `onStartRecording` | `() => void` | Open recorder overlay |
| `onUpload` | `() => void` | Open file upload picker |
| `onTranscribe` | `(recordingId: string) => void` | Trigger AI transcription |
| `onRename` | `(recordingId: string, name: string) => void` | Rename a recording |
| `onDelete` | `(recordingId: string) => void` | Delete a recording |
| `onMove` | `(recordingId: string, folderId: string) => void` | Move recording to folder |
| `onCreateFolder` | `(name: string) => void` | Create a new folder |
| `onRenameFolder` | `(folderId: string, name: string) => void` | Rename a folder |
| `onDeleteFolder` | `(folderId: string) => void` | Delete a folder |
| `onRecorderPause` | `() => void` | Pause recording |
| `onRecorderResume` | `() => void` | Resume recording |
| `onRecorderStop` | `() => void` | Stop recording |
| `onRecorderCancel` | `() => void` | Cancel recording |
| `onSave` | `(name: string, folderId: string) => void` | Save after recording or upload |
| `onBack` | `() => void` | Back to list from detail |

### Recording data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Recording identifier |
| `userId` | `string` | Owner user ID |
| `name` | `string` | Recording name |
| `folderId` | `string` | Parent folder ID |
| `folderName` | `string` | Parent folder display name |
| `duration` | `number` | Duration in seconds |
| `createdAt` | `string` | ISO timestamp |
| `transcriptionStatus` | `TranscriptionStatus` | `'none' \| 'processing' \| 'completed'` |
| `audioUrl` | `string` | Audio file URL for playback |

### TranscriptionResult data shape

| Field | Type | Description |
|-------|------|-------------|
| `fullTranscript` | `string` | Complete transcript text |
| `summary` | `string` | Executive summary |
| `keyTakeaways` | `string[]` | Bulleted key points |
| `actionItems` | `string[]` | Detected tasks/agreements |
| `completedAt` | `string` | ISO timestamp |

### RecorderData data shape

| Field | Type | Description |
|-------|------|-------------|
| `state` | `RecorderState` | `'idle' \| 'recording' \| 'paused'` |
| `elapsedSeconds` | `number` | Time elapsed |
| `maxSeconds` | `number` | Maximum duration (1800) |
| `volumeLevel` | `number` | Volume level 0-100 |

### Folder data shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Folder identifier |
| `name` | `string` | Folder display name |
| `recordingCount` | `number` | Number of recordings in this folder |

## Expected User Flows

### Flow 1: User records and saves audio
1. User opens AI Transcription and clicks the "Record" button
2. The recorder overlay opens showing a live waveform, elapsed time (00:00), remaining time (30:00), and volume meter
3. User speaks — the waveform animates and elapsed time counts up
4. User clicks "Stop" — the save dialog appears with name input and folder selector
5. User enters a name, selects a folder, and clicks "Save" — `onSave` fires, recording appears in the list

### Flow 2: User transcribes a recording
1. User clicks on a recording card to open the detail view
2. User sees the audio player, recording metadata, and a prominent "Transcribe" button
3. User clicks "Transcribe" — `onTranscribe` fires, a processing spinner/skeleton displays
4. When transcription completes, four tabs appear: Transcript, Summary, Takeaways, Action Items
5. User switches between tabs to review the AI-generated content

### Flow 3: User uploads an audio file
1. User clicks "Upload" and selects an MP3/WAV/M4A file from their device
2. The save dialog appears — user enters a name and selects a folder
3. User clicks "Save" — the uploaded recording appears in the list with "Not transcribed" status
4. User can then open it and trigger transcription

### Flow 4: User organizes recordings in folders
1. User creates a new folder called "Juntas de Personal" via the folder sidebar
2. User opens a recording's detail and clicks "Move" — selects the new folder
3. User filters the list by clicking the folder in the sidebar — only recordings in that folder are shown
4. User renames the folder and verifies the update

## Empty States

- **No recordings yet**: "No tienes grabaciones aun" / "You don't have any recordings yet" with CTAs to record or upload
- **No transcription yet**: In the detail view, show the "Transcribe" button prominently with a message "Click to generate the transcript" / "Haz clic para generar la transcripcion"
- **Empty folder**: "Esta carpeta esta vacia" / "This folder is empty" with CTAs to record, upload, or move a recording here
- **No search results**: "No se encontraron grabaciones" / "No recordings found" with a suggestion to adjust the search
- **Processing**: Skeleton loader or spinner with a message "Transcribing... this may take a moment" / "Transcribiendo... esto puede tomar un momento"

## Testing

Refer to `sections/ai-transcription/tests.md` for detailed test specs covering:
- Recordings list renders with correct data
- Folder sidebar filtering
- Search filtering by name
- Recorder overlay controls (pause, resume, stop, cancel)
- 30-minute max enforcement
- Save dialog after recording and upload
- Transcription trigger and processing state
- Tabbed results display
- Recording rename, delete, and move
- Folder CRUD operations
- Privacy (user only sees their own recordings)

## Files to Reference

| File | Purpose |
|------|---------|
| `product/sections/ai-transcription/spec.md` | Full section specification |
| `product/sections/ai-transcription/types.ts` | TypeScript interfaces |
| `product/sections/ai-transcription/data.json` | Sample data |
| `sections/ai-transcription/components/AITranscriptionView.tsx` | Root transcription component |
| `sections/ai-transcription/components/RecordingCard.tsx` | Recording card component |

## Done When

- [ ] AI Transcription section renders inside the AppShell (hidden from student sidebar)
- [ ] Recordings list displays cards with name, folder badge, duration, date, and transcription status
- [ ] Folder sidebar shows folders with recording counts and "All" default
- [ ] Clicking a folder filters the recordings list
- [ ] Folder CRUD (create, rename, delete) works correctly
- [ ] Search bar filters recordings by name
- [ ] "Record" button opens the recorder overlay
- [ ] Recorder shows live waveform, elapsed time, remaining time (30 min max), and volume meter
- [ ] Pause, resume, stop, and cancel controls work correctly
- [ ] Recording auto-stops at 30-minute limit
- [ ] Save dialog appears after recording with name input and folder selector
- [ ] "Upload" button opens file picker for MP3, WAV, M4A
- [ ] Uploaded files go through the same save dialog
- [ ] Recording detail view shows audio player with play/pause and scrub bar
- [ ] "Transcribe" button appears when transcription status is "none"
- [ ] Processing state shows skeleton/spinner during transcription
- [ ] Completed transcription displays in 4 tabs: Transcript, Summary, Takeaways, Action Items
- [ ] Action items display as a visual checklist (read-only)
- [ ] Recordings can be renamed, deleted, and moved between folders
- [ ] All recordings are private per user
- [ ] All empty states display with appropriate messages
