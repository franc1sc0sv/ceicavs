import { useState } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface EmojiPickerPopoverProps {
  onEmojiSelect: (native: string) => void
  children: React.ReactElement
}

export function EmojiPickerPopover({ onEmojiSelect, children }: EmojiPickerPopoverProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={children} />
      <PopoverContent className="w-auto p-0 border-0">
        <Picker
          data={data}
          onEmojiSelect={(emoji: { native: string }) => {
            onEmojiSelect(emoji.native)
            setOpen(false)
          }}
          locale="es"
          theme="light"
          previewPosition="none"
          skinTonePosition="search"
          emojiSize={20}
          emojiButtonSize={28}
          perLine={8}
        />
      </PopoverContent>
    </Popover>
  )
}
