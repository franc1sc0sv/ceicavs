# AI Transcription

## Overview

Audio recording and transcription module for admins and teachers. Users record audio via microphone (30 min max) or upload audio files, organize them into folders, and manually trigger AI transcription. Results display in tabbed sections: full transcript, summary, key takeaways, and action items. All recordings and transcriptions are private per user.

## Components Provided

- `AITranscriptionView` — Top-level container managing the recordings list with folder sidebar, recording detail view, recorder overlay, and save dialog. Handles navigation between list and detail views.
- `RecordingCard` — A card in the recordings list showing recording name, folder badge, duration, creation date, and transcription status indicator (not transcribed / processing / transcribed).

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onRecordingClick(recordingId: string)` | User clicks a recording card to open its detail view |
| `onFolderSelect(folderId: string \| null)` | User selects a folder in the sidebar to filter recordings (null for "All") |
| `onSearch(query: string)` | User types in the search bar to filter recordings by name |
| `onStartRecording()` | User clicks the "Record" button to open the recorder overlay |
| `onUpload()` | User clicks the "Upload" button to select an audio file from their device |
| `onTranscribe(recordingId: string)` | User clicks "Transcribe" on a recording that has not been transcribed |
| `onRename(recordingId: string, name: string)` | User renames a recording |
| `onDelete(recordingId: string)` | User deletes a recording |
| `onMove(recordingId: string, folderId: string)` | User moves a recording to a different folder |
| `onCreateFolder(name: string)` | User creates a new folder |
| `onRenameFolder(folderId: string, name: string)` | User renames an existing folder |
| `onDeleteFolder(folderId: string)` | User deletes a folder |
| `onBack()` | User navigates back from recording detail to the recordings list |

## Data Shapes

**`Recording`** — A recording entry: `id`, `userId`, `name`, `folderId`, `folderName`, `duration` (seconds), `createdAt`, `transcriptionStatus` (none/processing/completed), `audioUrl?`.

**`Folder`** — A folder: `id`, `name`, `recordingCount`.

**`TranscriptionResult`** — AI output: `fullTranscript`, `summary`, `keyTakeaways` (string[]), `actionItems` (string[]), `completedAt`.

**`RecordingDetail`** — Full recording with optional transcription: `recording`, `transcription?`.

**`RecorderData`** — Live recorder state: `state` (idle/recording/paused), `elapsedSeconds`, `maxSeconds` (1800), `volumeLevel` (0-100).

**`AITranscriptionProps`** — Top-level: `recordings`, `folders`, `selectedFolderId?`, `searchQuery?`, `selectedDetail?`, `recorder?`, plus all callbacks (including recorder callbacks: `onRecorderPause`, `onRecorderResume`, `onRecorderStop`, `onRecorderCancel`, `onSave`).

See `types.ts` for full interface definitions.
