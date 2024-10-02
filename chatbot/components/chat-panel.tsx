import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { FooterText } from '@/components/footer'
import { PromptForm } from '@/components/prompt-form'
import { anonymizeMessages, requestChatbot } from '@/lib/chat/actions'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'sonner'
import { useAllowlist } from '../lib/hooks/use-allowlist'
import { useEntities } from '../lib/hooks/use-entities'
import { ChatbotMessage, DeanyonmizationMapping } from '../lib/types'

export interface ChatPanelProps {
  input: string
  setInput: (value: string) => void
  anonymizedMessages: ChatbotMessage[]
  setAnonymizedMessages: Dispatch<SetStateAction<ChatbotMessage[]>>
  deanonmizationMapping: DeanyonmizationMapping
  setDeanoymizationMapping: Dispatch<SetStateAction<DeanyonmizationMapping>>
  isAtBottom: boolean
  scrollToBottom: () => void
  isAnonymizationLoading: boolean
  setIsAnonymizationLoading: Dispatch<SetStateAction<boolean>>
  setIsChatbotResponseLoading: Dispatch<SetStateAction<boolean>>
}

export function ChatPanel({
  input,
  setInput,
  anonymizedMessages,
  setAnonymizedMessages,
  deanonmizationMapping,
  setDeanoymizationMapping,
  isAtBottom,
  scrollToBottom,
  isAnonymizationLoading,
  setIsAnonymizationLoading,
  setIsChatbotResponseLoading
}: ChatPanelProps) {
  const { allowlist } = useAllowlist()
  const { entities } = useEntities()
  const [anonymizedMessageDialog, setAnonymizedMessageDialog] = useState('')

  const examplePrompt = `Please craft a response to this customer email:
      Dear Support Team,
      I hope you're doing well. I recently placed an order (#98765) and received it yesterday at my address: 456 Maple Street, San Francisco. Unfortunately, one of the items (Product Code: A1234) arrived damaged.
      Can you please advise on how I can return the item or get a replacement? I’ve attached a few pictures of the damage. Feel free to reach me at jane.smith@email.com or call me at 415-987-6543 if you need more information.
      Thank you for your assistance!
      Best regards,
      Jane Smith`

  const submitMessage = async (messageText: string) => {
    try {
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

      const newAnonymizedMessages: ChatbotMessage[] = [
        ...anonymizedMessages,
        {
          role: 'user',
          content: anonymizationResponse.anonymized_messages[0]?.content
        }
      ]

      setAnonymizedMessages([...newAnonymizedMessages])

      setDeanoymizationMapping(
        anonymizationResponse.updated_deanonymization_mapping
      )

      setIsChatbotResponseLoading(true)

      const chatbotResponse = await requestChatbot([...newAnonymizedMessages])

      setAnonymizedMessages(currentMessages => [
        ...currentMessages,
        chatbotResponse
      ])

      setIsChatbotResponseLoading(false)
    } catch (exception: any) {
      toast.error('An error occurred: ' + exception?.message)
    } finally {
      setIsAnonymizationLoading(false)
      setIsChatbotResponseLoading(false)
      setAnonymizedMessageDialog('')
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 px-4 sm:px-0">
          {!isAnonymizationLoading && anonymizedMessages.length === 0 && (
            <div
              className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 `}
              onClick={() => submitMessage(examplePrompt)}
            >
              <div className="text-md font-semibold pb-2">
                Please craft a response to this customer email
              </div>
              <div className="text-md text-zinc-600">
                Dear Support Team,
                <br />I hope you&apos;re doing well. I recently placed an order
                (#98765) and received it yesterday at my address: 456 Maple
                Street, San Francisco. Unfortunately, one of the items (Product
                Code: A1234) arrived damaged. Can you please advise on how I can
                return the item or get a replacement? I&apos;ve attached a few
                pictures of the damage. Feel free to reach me at
                jane.smith@email.com or call me at 415-987-6543 if you need more
                information. Thank you for your assistance! Best regards, Jane
                Smith
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            input={input}
            setInput={setInput}
            submitMessage={submitMessage}
            deanonmizationMapping={deanonmizationMapping}
            anonymizedMessages={anonymizedMessages}
            setAnonymizedMessages={setAnonymizedMessages}
            setDeanoymizationMapping={setDeanoymizationMapping}
            anonymizedMessageDialog={anonymizedMessageDialog}
            setAnonymizedMessageDialog={setAnonymizedMessageDialog}
            setIsChatbotResponseLoading={setIsChatbotResponseLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
