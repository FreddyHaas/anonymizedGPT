import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import React, { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { anonymizeMessages, requestChatbot } from '../lib/chat/actions'
import { useAllowlist } from '../lib/hooks/use-allowlist'
import { useAnonymizedView } from '../lib/hooks/use-anonymized-view'
import { useEntities } from '../lib/hooks/use-entities'
import { ChatbotMessage, DeanyonmizationMapping } from '../lib/types'
import { AnonymizedText } from './message/message'
import { spinner } from './message/spinner'
import { IconMagnifyingGlass } from './ui/icons'
import { Textarea } from './ui/textarea'

export function PreviewAnonymizationDialog({
  input,
  setInput,
  open,
  setOpen,
  deanonmizationMapping,
  anonymizedMessages,
  setAnonymizedMessages,
  setDeanoymizationMapping,
  anonymizedMessageDialog,
  setAnonymizedMessageDialog: setAnonymizedTextDialog,
  submitMessage,
  setIsChatbotResponseLoading
}: {
  input: string
  setInput: (value: string) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  anonymizedMessages: ChatbotMessage[]
  setAnonymizedMessages: React.Dispatch<React.SetStateAction<ChatbotMessage[]>>
  deanonmizationMapping: DeanyonmizationMapping
  setDeanoymizationMapping: Dispatch<SetStateAction<DeanyonmizationMapping>>
  anonymizedMessageDialog: string
  setAnonymizedMessageDialog: React.Dispatch<React.SetStateAction<string>>
  submitMessage: (message: string) => Promise<void>
  setIsChatbotResponseLoading: Dispatch<SetStateAction<boolean>>
}) {
  const { allowlist } = useAllowlist()
  const { entities } = useEntities()
  const { anonymizedView, setAnonymizedView } = useAnonymizedView()
  const [deanonmizationMappingDialog, setDeanonymizationMappingDialog] =
    React.useState(deanonmizationMapping)
  const [latestChangeAnonymized, setLatestChangeAnonymized] =
    React.useState(false)
  const [isAnonymizationLoading, setIsAnonymizationLoading] =
    React.useState(false)

  const anonymize = async () => {
    try {
      const messageText = input.trim()
      if (!messageText) return

      const message: ChatbotMessage = {
        role: 'user',
        content: messageText
      }

      setIsAnonymizationLoading(true)

      const anonymizationResponse = await anonymizeMessages(
        [message],
        allowlist,
        entities,
        deanonmizationMapping
      )

      setIsAnonymizationLoading(false)

      setAnonymizedTextDialog(
        anonymizationResponse.anonymized_messages[0].content
      )
      setDeanonymizationMappingDialog(
        anonymizationResponse.updated_deanonymization_mapping
      )

      setLatestChangeAnonymized(true)
    } catch (exception: any) {
      toast.error('Anonymization failed: ' + exception?.message)
    } finally {
      setIsAnonymizationLoading(false)
    }
  }

  const submitMessageWithExistingAnonymization = async (
    anonymizedMessage: string
  ) => {
    try {
      const message: ChatbotMessage = {
        role: 'user',
        content: anonymizedMessage
      }

      setAnonymizedMessages(currentMessages => [...currentMessages, message])

      setDeanoymizationMapping(deanonmizationMappingDialog)

      setIsChatbotResponseLoading(true)

      const chatbotResponse = await requestChatbot([
        ...anonymizedMessages,
        message
      ])

      setIsChatbotResponseLoading(false)

      setAnonymizedMessages(currentMessages => [
        ...currentMessages,
        chatbotResponse
      ])
    } catch (exception: any) {
      toast.error('Chatbot response failed: ' + exception?.message)
    } finally {
      setIsChatbotResponseLoading(false)
    }
  }

  const handleSubmit = () => {
    if (latestChangeAnonymized) {
      submitMessageWithExistingAnonymization(anonymizedMessageDialog)
    } else {
      submitMessage(input)
    }
    setAnonymizedTextDialog('')
    setInput('')
    setOpen(false)
  }

  const onInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    setLatestChangeAnonymized(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="icon" variant={'outline'}>
          <IconMagnifyingGlass />
          <span className="sr-only">Preview anonymization</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Anonymization preview</DialogTitle>
        </DialogHeader>
        <div className="flex flex-auto gap-4 py-4 items-stretch">
          <div className="grow w-1 flex flex-col">
            <h2 className="font-semibold pb-1">Input</h2>
            <Textarea
              value={input}
              onChange={onInputChange}
              className="resize-none grow min-h-[300px]"
              placeholder="Type your prompt here"
            ></Textarea>
          </div>
          <div className="grow w-1 flex flex-col">
            <h2 className="font-semibold pb-1">Anonymized text</h2>
            <div className="flex min-h-[60px] grow w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
              {isAnonymizationLoading ? (
                <div className="size-full flex items-center justify-center gap-2">
                  {spinner}
                  <p>Loading anonymization</p>
                </div>
              ) : (
                <AnonymizedText
                  anonymizedText={anonymizedMessageDialog}
                  deanonymizerMapping={deanonmizationMappingDialog}
                  anonymizedView={anonymizedView}
                  setAnonymizedView={setAnonymizedView}
                ></AnonymizedText>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={anonymize} disabled={input === ''}>
            Anonymize
          </Button>
          <Button onClick={handleSubmit} disabled={input === ''}>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
