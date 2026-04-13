import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'

interface ReportFiltersProps {
  groupId: string
  dateFrom: string
  dateTo: string
  groups: Array<{ id: string; name: string }>
  groupsLoading: boolean
  onGroupChange: (id: string) => void
  onDateFromChange: (date: string) => void
  onDateToChange: (date: string) => void
  onRun: () => void
  loading: boolean
}

export function ReportFilters({
  groupId,
  dateFrom,
  dateTo,
  groups,
  groupsLoading,
  onGroupChange,
  onDateFromChange,
  onDateToChange,
  onRun,
  loading,
}: ReportFiltersProps) {
  const { t } = useTranslation('attendance')

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end flex-wrap">
      <div className="flex flex-col gap-1.5 w-full sm:w-auto">
        <label className="text-sm font-medium text-muted-foreground">{t('reports.group')}</label>
        <Select value={groupId} onValueChange={(value) => { if (value) onGroupChange(value) }} disabled={groupsLoading}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder={t('reports.groupPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted-foreground">{t('reports.dateFrom')}</label>
        <DatePicker value={dateFrom} onChange={onDateFromChange} disabled={loading} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted-foreground">{t('reports.dateTo')}</label>
        <DatePicker value={dateTo} onChange={onDateToChange} disabled={loading} />
      </div>

      <Button
        onClick={onRun}
        disabled={loading || !groupId}
        className="self-end"
      >
        {t('reports.run')}
      </Button>
    </div>
  )
}
