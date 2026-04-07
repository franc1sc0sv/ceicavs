import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

const registry = new Map<string, LazyExoticComponent<ComponentType>>([
  ['905e288c-c230-5693-a1f2-b313a5bf186d', lazy(() => import('./implementations/random-student-picker').then(m => ({ default: m.RandomStudentPicker })))],
  ['dc3e3796-69b9-5f15-bdc3-3321e11e97a4', lazy(() => import('./implementations/countdown-timer').then(m => ({ default: m.CountdownTimer })))],
  ['2b415492-81df-518c-a7f5-70a10c03c1c7', lazy(() => import('./implementations/task-organizer').then(m => ({ default: m.TaskOrganizer })))],
  ['21781fa3-0ed4-517b-84ac-245dcb99aeae', lazy(() => import('./implementations/coming-soon').then(m => ({ default: m.ComingSoon })))],
  ['ed9ea594-629f-50ee-835d-d62afd7abdd9', lazy(() => import('./implementations/image-format-converter').then(m => ({ default: m.ImageFormatConverter })))],
  ['ca48be9f-0b21-5db8-b125-f6ccd11ae9de', lazy(() => import('./implementations/coming-soon').then(m => ({ default: m.ComingSoon })))],
  ['febbfeb4-f43e-5643-bd2d-340f4aeee76b', lazy(() => import('./implementations/image-compressor').then(m => ({ default: m.ImageCompressor })))],
  ['44284731-2fbb-5a63-be96-cfd706140c67', lazy(() => import('./implementations/qr-code-generator').then(m => ({ default: m.QrCodeGenerator })))],
  ['9705a1c2-7a9b-54fe-be1e-19295065118c', lazy(() => import('./implementations/coming-soon').then(m => ({ default: m.ComingSoon })))],
  ['8a7088d7-8199-5d58-a5c9-dd73feebe7ea', lazy(() => import('./implementations/quick-notes').then(m => ({ default: m.QuickNotes })))],
  ['43873f40-488b-52de-9ecf-63183dcd91ec', lazy(() => import('./implementations/scientific-calculator').then(m => ({ default: m.ScientificCalculator })))],
  ['ccecb121-4c51-52fd-b638-04cc9af830b7', lazy(() => import('./implementations/password-generator').then(m => ({ default: m.PasswordGenerator })))],
  ['ruleta-tool-id-00000000000000000001', lazy(() => import('./implementations/ruleta').then(m => ({ default: m.Ruleta })))],
])

export function getToolComponent(toolId: string): LazyExoticComponent<ComponentType> | null {
  return registry.get(toolId) ?? null
}
