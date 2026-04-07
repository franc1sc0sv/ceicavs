export type ToolColor =
  | 'lime'
  | 'amber'
  | 'sky'
  | 'rose'
  | 'violet'
  | 'orange'
  | 'stone'
  | 'cyan'
  | 'yellow'
  | 'indigo'
  | 'fuchsia'
  | 'emerald'
  | 'red'

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

export const CATEGORIES: ToolCategory[] = [
  { id: 'c739e32e-d641-5b3f-bb19-802037f42f0a', name: 'Teaching & Classroom', slug: 'teaching-classroom', order: 1 },
  { id: 'ef060fcc-c843-5b1a-9445-658fca1f7113', name: 'File Converters', slug: 'file-converters', order: 2 },
  { id: '546d5904-58f7-5e85-a789-112e2b52e32c', name: 'Media Tools', slug: 'media-tools', order: 3 },
  { id: 'b1d8b16d-8ead-5aa8-be3a-1b532eee43ec', name: 'Productivity', slug: 'productivity', order: 4 },
]

export const TOOLS: Tool[] = [
  {
    id: '905e288c-c230-5693-a1f2-b313a5bf186d',
    name: 'Random Student Picker',
    description: 'Pick a student at random with a shuffle animation — fair and instant',
    categoryId: 'c739e32e-d641-5b3f-bb19-802037f42f0a',
    icon: 'users',
    color: 'lime',
  },
  {
    id: 'dc3e3796-69b9-5f15-bdc3-3321e11e97a4',
    name: 'Countdown Timer',
    description: 'Set timers and stopwatches for classroom activities and exams',
    categoryId: 'c739e32e-d641-5b3f-bb19-802037f42f0a',
    icon: 'clock',
    color: 'amber',
  },
  {
    id: '2b415492-81df-518c-a7f5-70a10c03c1c7',
    name: 'Task Organizer',
    description: 'Create and manage task lists for lessons, assignments, or personal to-dos',
    categoryId: 'c739e32e-d641-5b3f-bb19-802037f42f0a',
    icon: 'check-square',
    color: 'sky',
  },
  {
    id: '21781fa3-0ed4-517b-84ac-245dcb99aeae',
    name: 'Word / PDF Converter',
    description: 'Convert PDF files to Word and Word documents to PDF instantly',
    categoryId: 'ef060fcc-c843-5b1a-9445-658fca1f7113',
    icon: 'file-text',
    color: 'rose',
  },
  {
    id: 'ed9ea594-629f-50ee-835d-d62afd7abdd9',
    name: 'Image Format Converter',
    description: 'Convert images between PNG, JPG, and WebP formats with quality control',
    categoryId: 'ef060fcc-c843-5b1a-9445-658fca1f7113',
    icon: 'image',
    color: 'violet',
  },
  {
    id: 'ca48be9f-0b21-5db8-b125-f6ccd11ae9de',
    name: 'YouTube Downloader',
    description: 'Paste a YouTube URL, choose quality, and download the video for offline use',
    categoryId: '546d5904-58f7-5e85-a789-112e2b52e32c',
    icon: 'download',
    color: 'red',
  },
  {
    id: 'febbfeb4-f43e-5643-bd2d-340f4aeee76b',
    name: 'Image Compressor',
    description: 'Reduce image file size and resize without losing visible quality',
    categoryId: '546d5904-58f7-5e85-a789-112e2b52e32c',
    icon: 'minimize-2',
    color: 'orange',
  },
  {
    id: '44284731-2fbb-5a63-be96-cfd706140c67',
    name: 'QR Code Generator',
    description: 'Generate QR codes from any text or URL — perfect for sharing links',
    categoryId: '546d5904-58f7-5e85-a789-112e2b52e32c',
    icon: 'grid',
    color: 'stone',
  },
  {
    id: '9705a1c2-7a9b-54fe-be1e-19295065118c',
    name: 'Screenshot to Text',
    description: 'Upload a screenshot or image and extract text using OCR — ideal for digitizing materials',
    categoryId: '546d5904-58f7-5e85-a789-112e2b52e32c',
    icon: 'scan',
    color: 'cyan',
  },
  {
    id: '8a7088d7-8199-5d58-a5c9-dd73feebe7ea',
    name: 'Quick Notes',
    description: 'A simple notepad to jot down ideas, reminders, or class notes on the fly',
    categoryId: 'b1d8b16d-8ead-5aa8-be3a-1b532eee43ec',
    icon: 'edit-3',
    color: 'yellow',
  },
  {
    id: '43873f40-488b-52de-9ecf-63183dcd91ec',
    name: 'Scientific Calculator',
    description: 'Full scientific calculator with trigonometry, logarithms, and expression history',
    categoryId: 'b1d8b16d-8ead-5aa8-be3a-1b532eee43ec',
    icon: 'hash',
    color: 'indigo',
  },
  {
    id: 'ccecb121-4c51-52fd-b638-04cc9af830b7',
    name: 'Password Generator',
    description: 'Generate secure random passwords with customizable length and character options',
    categoryId: 'b1d8b16d-8ead-5aa8-be3a-1b532eee43ec',
    icon: 'lock',
    color: 'fuchsia',
  },
  {
    id: 'ruleta-tool-id-00000000000000000001',
    name: 'Roulette',
    description: 'Add custom options and spin the wheel to pick at random — great for draws and decisions',
    categoryId: 'b1d8b16d-8ead-5aa8-be3a-1b532eee43ec',
    icon: 'rotate-cw',
    color: 'emerald',
  },
]
