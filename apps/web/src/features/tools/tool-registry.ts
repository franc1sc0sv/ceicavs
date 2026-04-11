import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

const registry = new Map<string, LazyExoticComponent<ComponentType>>([
  ['random-student-picker', lazy(() => import('./implementations/random-student-picker/random-student-picker').then(m => ({ default: m.RandomStudentPicker })))],
  ['countdown-timer', lazy(() => import('./implementations/countdown-timer/countdown-timer').then(m => ({ default: m.CountdownTimer })))],
  ['task-organizer', lazy(() => import('./implementations/task-organizer/task-organizer').then(m => ({ default: m.TaskOrganizer })))],
  ['text-simplifier', lazy(() => import('./implementations/text-simplifier/text-simplifier').then(m => ({ default: m.TextSimplifier })))],
  ['word-pdf-converter', lazy(() => import('./implementations/word-pdf-converter/word-pdf-converter').then(m => ({ default: m.WordPdfConverter })))],
  ['image-format-converter', lazy(() => import('./implementations/image-format-converter/image-format-converter').then(m => ({ default: m.ImageFormatConverter })))],
  ['youtube-downloader', lazy(() => import('./implementations/youtube-downloader/youtube-downloader').then(m => ({ default: m.YoutubeDownloader })))],
  ['image-compressor', lazy(() => import('./implementations/image-compressor/image-compressor').then(m => ({ default: m.ImageCompressor })))],
  ['qr-code-generator', lazy(() => import('./implementations/qr-code-generator/qr-code-generator').then(m => ({ default: m.QrCodeGenerator })))],
  ['screenshot-to-text', lazy(() => import('./implementations/screenshot-to-text/screenshot-to-text').then(m => ({ default: m.ScreenshotToText })))],
  ['quick-notes', lazy(() => import('./implementations/quick-notes/quick-notes').then(m => ({ default: m.QuickNotes })))],
  ['scientific-calculator', lazy(() => import('./implementations/scientific-calculator/scientific-calculator').then(m => ({ default: m.ScientificCalculator })))],
  ['password-generator', lazy(() => import('./implementations/password-generator/password-generator').then(m => ({ default: m.PasswordGenerator })))],
  ['roulette', lazy(() => import('./implementations/ruleta/ruleta').then(m => ({ default: m.Ruleta })))],
])

export function getToolComponent(slug: string): LazyExoticComponent<ComponentType> | null {
  return registry.get(slug) ?? null
}
