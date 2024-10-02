'use client'

import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { ChatbotMessage, DeanyonmizationMapping } from '../lib/types'
import { PreviewAnonymizationDialog } from './preview-anonymization-dialog'

export function PromptForm({
  input,
  setInput,
  submitMessage,
  anonymizedMessages,
  setAnonymizedMessages,
  deanonmizationMapping,
  setDeanoymizationMapping,
  anonymizedMessageDialog,
  setAnonymizedMessageDialog,
  setIsChatbotResponseLoading
}: {
  input: string
  setInput: (value: string) => void
  submitMessage: (message: string) => Promise<void>
  anonymizedMessages: ChatbotMessage[]
  setAnonymizedMessages: React.Dispatch<React.SetStateAction<ChatbotMessage[]>>
  deanonmizationMapping: DeanyonmizationMapping
  setDeanoymizationMapping: React.Dispatch<
    React.SetStateAction<DeanyonmizationMapping>
  >
  anonymizedMessageDialog: string
  setAnonymizedMessageDialog: React.Dispatch<React.SetStateAction<string>>
  setIsChatbotResponseLoading: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Blur focus on mobile
    if (window.innerWidth < 600) {
      e.target['message']?.blur()
    }

    const value = input.trim()
    setInput('')
    if (!value) return

    submitMessage(value)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                router.push('/new')
              }}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message"
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4 flex gap-2">
          <PreviewAnonymizationDialog
            input={input}
            setInput={setInput}
            open={dialogOpen}
            setOpen={setDialogOpen}
            deanonmizationMapping={deanonmizationMapping}
            anonymizedMessages={anonymizedMessages}
            setAnonymizedMessages={setAnonymizedMessages}
            setDeanoymizationMapping={setDeanoymizationMapping}
            anonymizedMessageDialog={anonymizedMessageDialog}
            setAnonymizedMessageDialog={setAnonymizedMessageDialog}
            submitMessage={submitMessage}
            setIsChatbotResponseLoading={setIsChatbotResponseLoading}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={input === ''}>
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
