import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import type { ImportUsersInput, UserRole } from '@/generated/graphql'

interface CsvRow {
  name: string
  email: string
  role: UserRole
}

interface ImportResult {
  created: number
  skipped: number
  errors: string[]
}

interface CsvImportSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (input: ImportUsersInput) => Promise<{ data?: { importUsers?: ImportResult | null } | null }>
  loading: boolean
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = values[i] ?? ''
    })
    return { name: row.name ?? '', email: row.email ?? '', role: (row.role ?? '') as UserRole }
  })
}

export function CsvImportSheet({
  open,
  onOpenChange,
  onImport,
  loading,
}: CsvImportSheetProps) {
  const { t } = useTranslation('people')
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<CsvRow[]>([])
  const [, setCsvContent] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setCsvContent(text)
      setRows(parseCsv(text))
      setResult(null)
    }
    reader.readAsText(file)
  }

  async function handleImport() {
    if (rows.length === 0) return
    const res = await onImport({ rows })
    if (res.data?.importUsers) {
      setResult(res.data.importUsers)
    }
  }


  function handleClose() {
    setRows([])
    setCsvContent('')
    setResult(null)
    if (fileRef.current) fileRef.current.value = ''
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('import.title')}</SheetTitle>
          <SheetDescription>{t('import.description')}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 py-2">
          <label
            htmlFor="csv-file-input"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-ring hover:bg-muted/30"
          >
            {t('import.dropHint')}
            <input
              id="csv-file-input"
              ref={fileRef}
              type="file"
              accept=".csv"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
          {rows.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium">{t('users.columns.name')}</th>
                    <th className="px-3 py-2 text-left font-medium">{t('users.columns.email')}</th>
                    <th className="px-3 py-2 text-left font-medium">{t('users.columns.role')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-3 py-2">{row.name}</td>
                      <td className="px-3 py-2">{row.email}</td>
                      <td className="px-3 py-2">{row.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {result && (
            <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm space-y-1">
              <p className="text-green-700 dark:text-green-400">
                {t('import.result.created', { count: result.created })}
              </p>
              <p className="text-amber-700 dark:text-amber-400">
                {t('import.result.skipped', { count: result.skipped })}
              </p>
              {result.errors.length > 0 && (
                <p className="text-destructive">
                  {t('import.result.errors')}: {result.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
        <SheetFooter className="px-4">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            {t('import.cancel')}
          </Button>
          <Button onClick={handleImport} disabled={loading || rows.length === 0}>
            {t('import.import', { count: rows.length })}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
