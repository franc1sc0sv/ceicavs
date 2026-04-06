import { useState, useCallback, useEffect, useRef } from 'react'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Grid } from '@giphy/react-components'
interface GiphyGif {
  images: { downsized_medium: { url: string } }
  title: string
}
import { useTranslation } from 'react-i18next'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'

const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY)

interface GiphyPickerPopoverProps {
  onGifSelect: (url: string, alt: string) => void
  children: React.ReactNode
}

export function GiphyPickerPopover({ onGifSelect, children }: GiphyPickerPopoverProps) {
  const { t } = useTranslation('blog')
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 300)

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchTerm])

  const fetchGifs = useCallback(
    (offset: number) => {
      if (!debouncedTerm) {
        return gf.trending({ offset, limit: 10 })
      }
      return gf.search(debouncedTerm, { offset, limit: 10 })
    },
    [debouncedTerm],
  )

  const handleGifClick = (gif: GiphyGif, e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault()
    onGifSelect(gif.images.downsized_medium.url, gif.title)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex cursor-pointer bg-transparent border-0 p-0">{children}</PopoverTrigger>
      <PopoverContent className="w-[320px] p-3">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('comments.searchGifs')}
        />
        <ScrollArea className="h-[240px] mt-2">
          <Grid
            key={debouncedTerm}
            columns={2}
            width={280}
            gutter={6}
            fetchGifs={fetchGifs}
            onGifClick={handleGifClick}
          />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
