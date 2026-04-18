import 'dotenv/config'
import { PrismaClient } from '../src/generated/client/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'bcryptjs'

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

const SALT_ROUNDS = 10

const users = [
  {
    name: 'Admin CEICAVS',
    email: 'admin@ceicavs.edu',
    password: 'Admin123!',
    role: 'admin' as const,
  },
  {
    name: 'Prof. García',
    email: 'teacher@ceicavs.edu',
    password: 'Teacher123!',
    role: 'teacher' as const,
  },
  {
    name: 'Estudiante Demo',
    email: 'student@ceicavs.edu',
    password: 'Student123!',
    role: 'student' as const,
  },
]

const toolCategories = [
  { name: 'Teaching & Classroom', slug: 'teaching-classroom', order: 1 },
  { name: 'File Converters', slug: 'file-converters', order: 2 },
  { name: 'Media Tools', slug: 'media-tools', order: 3 },
  { name: 'Productivity', slug: 'productivity', order: 4 },
]

type ToolSeed = {
  name: string
  slug: string
  description: string
  categorySlug: string
  icon: string
  color: string
}

const tools: ToolSeed[] = [
  {
    name: 'Random Student Picker',
    slug: 'random-student-picker',
    description: 'Pick a student at random with a shuffle animation — fair and instant',
    categorySlug: 'teaching-classroom',
    icon: 'users',
    color: 'lime',
  },
  {
    name: 'Countdown Timer',
    slug: 'countdown-timer',
    description: 'Set timers and stopwatches for classroom activities and exams',
    categorySlug: 'teaching-classroom',
    icon: 'clock',
    color: 'amber',
  },
  {
    name: 'Task Organizer',
    slug: 'task-organizer',
    description: 'Create and manage task lists for lessons, assignments, or personal to-dos',
    categorySlug: 'teaching-classroom',
    icon: 'check-square',
    color: 'sky',
  },
  {
    name: 'Word / PDF Converter',
    slug: 'word-pdf-converter',
    description: 'Convert PDF files to Word and Word documents to PDF instantly',
    categorySlug: 'file-converters',
    icon: 'file-text',
    color: 'rose',
  },
  {
    name: 'Image Format Converter',
    slug: 'image-format-converter',
    description: 'Convert images between PNG, JPG, and WebP formats with quality control',
    categorySlug: 'file-converters',
    icon: 'image',
    color: 'violet',
  },
  {
    name: 'Image Compressor',
    slug: 'image-compressor',
    description: 'Reduce image file size and resize without losing visible quality',
    categorySlug: 'media-tools',
    icon: 'minimize-2',
    color: 'orange',
  },
  {
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    description: 'Generate QR codes from any text or URL — perfect for sharing links',
    categorySlug: 'media-tools',
    icon: 'grid',
    color: 'stone',
  },
  {
    name: 'Screenshot to Text',
    slug: 'screenshot-to-text',
    description:
      'Upload a screenshot or image and extract text using OCR — ideal for digitizing materials',
    categorySlug: 'media-tools',
    icon: 'scan',
    color: 'cyan',
  },
  {
    name: 'Quick Notes',
    slug: 'quick-notes',
    description: 'A simple notepad to jot down ideas, reminders, or class notes on the fly',
    categorySlug: 'productivity',
    icon: 'edit-3',
    color: 'yellow',
  },
  {
    name: 'Scientific Calculator',
    slug: 'scientific-calculator',
    description:
      'Full scientific calculator with trigonometry, logarithms, and expression history',
    categorySlug: 'productivity',
    icon: 'hash',
    color: 'indigo',
  },
  {
    name: 'Password Generator',
    slug: 'password-generator',
    description:
      'Generate secure random passwords with customizable length and character options',
    categorySlug: 'productivity',
    icon: 'lock',
    color: 'fuchsia',
  },
  {
    name: 'Roulette',
    slug: 'roulette',
    description:
      'Add custom options and spin the wheel to pick at random — great for draws and decisions',
    categorySlug: 'productivity',
    icon: 'rotate-cw',
    color: 'emerald',
  },
]

async function main() {
  for (const user of users) {
    const passwordHash = await hash(user.password, SALT_ROUNDS)
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: passwordHash,
        role: user.role,
      },
    })
    console.log(`Seeded user: ${user.email} (${user.role})`)
  }

  for (const category of toolCategories) {
    await prisma.toolCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, order: category.order },
      create: { name: category.name, slug: category.slug, order: category.order },
    })
  }
  console.log(`Seeded ${toolCategories.length} tool categories`)

  const categoryMap = new Map(
    (await prisma.toolCategory.findMany({ select: { id: true, slug: true } })).map((c) => [
      c.slug,
      c.id,
    ]),
  )

  for (const tool of tools) {
    const categoryId = categoryMap.get(tool.categorySlug)
    if (!categoryId) throw new Error(`Category slug not found: ${tool.categorySlug}`)

    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {
        name: tool.name,
        description: tool.description,
        categoryId,
        icon: tool.icon,
        color: tool.color,
      },
      create: {
        name: tool.name,
        slug: tool.slug,
        description: tool.description,
        categoryId,
        icon: tool.icon,
        color: tool.color,
      },
    })
  }
  console.log(`Seeded ${tools.length} tools`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
