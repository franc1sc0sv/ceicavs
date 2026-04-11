import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation } from '@apollo/client/react'
import { graphql } from '@/generated/gql'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const GET_SUMMARY_PROMPT = graphql(`
  query GetSummaryPrompt {
    getSummaryPrompt
  }
`)

const UPDATE_SUMMARY_PROMPT = graphql(`
  mutation UpdateSummaryPrompt($input: UpdateSummaryPromptInput!) {
    updateSummaryPrompt(input: $input)
  }
`)

interface SummaryPromptSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SummaryPromptSheet({ open, onOpenChange }: SummaryPromptSheetProps) {
  const { t } = useTranslation('transcription')
  const [value, setValue] = useState('')

  const { data, loading: queryLoading } = useQuery(GET_SUMMARY_PROMPT, {
    skip: !open,
    fetchPolicy: 'network-only',
  })

  const [updateSummaryPrompt, { loading: mutationLoading }] = useMutation(UPDATE_SUMMARY_PROMPT)

  useEffect(() => {
    if (data?.getSummaryPrompt != null) {
      setValue(data.getSummaryPrompt)
    } else if (data && data.getSummaryPrompt === null) {
      setValue('')
    }
  }, [data])

  const handleSave = async () => {
    await updateSummaryPrompt({ variables: { input: { prompt: value || null } } })
    onOpenChange(false)
  }

  const handleReset = async () => {
    setValue('')
    await updateSummaryPrompt({ variables: { input: { prompt: undefined } } })
  }

  const isBusy = queryLoading || mutationLoading

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t('prompt.title')}</SheetTitle>
          <SheetDescription>{t('prompt.description')}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-2 flex-1">
          <Label htmlFor="summary-prompt">{t('prompt.label')}</Label>
          <Textarea
            id="summary-prompt"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={12}
            className="resize-none"
            disabled={isBusy}
          />
          <p className="text-sm text-muted-foreground">{t('prompt.hint')}</p>
        </div>

        <SheetFooter className="flex flex-row gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isBusy}
          >
            {t('prompt.resetToDefault')}
          </Button>
          <Button onClick={handleSave} disabled={isBusy}>
            {t('prompt.save')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
