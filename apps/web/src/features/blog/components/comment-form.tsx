import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useComments } from '../hooks/use-comments'
import { EmojiPickerPopover } from './emoji-picker-popover'
import { GiphyPickerPopover } from './giphy-picker-popover'

interface CommentFormProps {
  postId: string
  parentId?: string | null
  onCancel?: () => void
}

export function CommentForm({ postId, parentId = null, onCancel }: CommentFormProps) {
  const { t } = useTranslation('blog')
  const [text, setText] = useState('')
  const [gifUrl, setGifUrl] = useState<string | null>(null)
  const [gifAlt, setGifAlt] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { addComment, adding } = useComments(postId)

  function insertEmoji(native: string) {
    const el = textareaRef.current
    if (!el) {
      setText((prev) => prev + native)
      return
    }
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = text.slice(0, start) + native + text.slice(end)
    setText(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + native.length, start + native.length)
    })
  }

  function handleGifSelect(url: string, alt: string) {
    setGifUrl(url)
    setGifAlt(alt)
  }

  function removeGif() {
    setGifUrl(null)
    setGifAlt(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!text.trim() && !gifUrl) return

    await addComment({
      variables: {
        input: {
          postId,
          parentId,
          text: text.trim(),
          gifUrl,
          gifAlt,
        },
      },
    })
    setText('')
    setGifUrl(null)
    setGifAlt(null)
    onCancel?.()
  }

  const canSubmit = (text.trim().length > 0 || gifUrl !== null) && !adding

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('comments.placeholder')}
        rows={3}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
        aria-label={t('comments.placeholder')}
      />

      {gifUrl && (
        <div className="relative inline-block mt-2">
          <img src={gifUrl} alt={gifAlt ?? ''} className="h-24 rounded-lg" />
          <button
            type="button"
            onClick={removeGif}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            aria-label={t('comments.removeGif')}
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <EmojiPickerPopover onEmojiSelect={insertEmoji}>
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label={t('comments.addEmoji')}
            >
              <Smile className="size-4" />
            </button>
          </EmojiPickerPopover>

          <GiphyPickerPopover onGifSelect={handleGifSelect}>
            <button
              type="button"
              className="flex items-center justify-center h-8 px-2 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label={t('comments.addGif')}
            >
              GIF
            </button>
          </GiphyPickerPopover>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              {t('form.cancel')}
            </Button>
          )}
          <Button type="submit" size="sm" disabled={!canSubmit}>
            {parentId ? t('actions.reply') : t('actions.add')}
          </Button>
        </div>
      </div>
    </form>
  )
}
