'use client'

import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { anonymizeMessages } from '@/lib/chat/actions'
import { useAllowlist } from '@/lib/hooks/use-allowlist'
import { useDenylistMapping } from '@/lib/hooks/use-denylist'
import { useEntities } from '@/lib/hooks/use-entities'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { ChatbotMessage, DeanyonmizationMapping } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const DENY_LIST_KEY = 'denylist'

export interface ChatProps extends React.ComponentProps<'div'> {
  missingKeys: string[]
}

export function Chat({ className, missingKeys }: ChatProps) {
  const [input, setInput] = useState('')
  const [anonymizedMessages, setAnonymizedMessages] = useState<
    ChatbotMessage[]
  >([])
  const [deanonymizationMapping, setDeanonymizationMapping] =
    useState<DeanyonmizationMapping>({})
  const [isAnonymizationLoading, setIsAnonymizationLoading] = useState(false)
  const [isChatbotResponseLoading, setIsChatbotResponseLoading] =
    useState(false)
  const { allowlist } = useAllowlist()
  const { entities } = useEntities()
  const { denylistMapping } = useDenylistMapping()

  useEffect(() => {
    if (anonymizedMessages.length === 0) return

    const anonymizeWithUpdatedSettings = async () => {
      const originalMessages = anonymizedMessages.map(message =>
        deanonymizeMessage(message, deanonymizationMapping)
      )

      const newDeanonymizationMapping = { [DENY_LIST_KEY]: denylistMapping }
      const response = await anonymizeMessages(
        originalMessages,
        allowlist,
        entities,
        newDeanonymizationMapping
      )

      setAnonymizedMessages(response.anonymized_messages as ChatbotMessage[])
      setDeanonymizationMapping(response.updated_deanonymization_mapping)
    }

    anonymizeWithUpdatedSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowlist, entities, denylistMapping])

  useEffect(() => {
    missingKeys.map(key => {
      toast.error(`Missing ${key} environment variable!`)
    })
  }, [missingKeys])

  function deanonymizeMessage(
    anonymizedMessage: ChatbotMessage,
    deanonmizationMapping: DeanyonmizationMapping
  ): ChatbotMessage {
    const anonymizedWords = Object.keys(deanonmizationMapping).flatMap(value =>
      Object.keys(deanonmizationMapping[value])
    )

    const escapeRegExp = (text: string) => {
      return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    const regex = new RegExp(
      `(${anonymizedWords.map(escapeRegExp).join('|')})`,
      'gi'
    )

    const segments = anonymizedMessage.content.split(regex)

    const deanonymizedText = segments.reduce((previous, segment) => {
      if (anonymizedWords.includes(segment)) {
        return previous.concat(
          deanonymizePhrase(segment, deanonmizationMapping)
        )
      } else {
        return previous.concat(segment)
      }
    }, '')

    return {
      ...anonymizedMessage,
      content: deanonymizedText
    }
  }

  function deanonymizePhrase(
    anonymizedPhrase: string,
    deanonmizationMapping: DeanyonmizationMapping
  ): string {
    const entities = Object.keys(deanonmizationMapping)

    for (const entity of entities) {
      if (
        deanonmizationMapping[entity] !== undefined &&
        deanonmizationMapping[entity][anonymizedPhrase]
      ) {
        return deanonmizationMapping[entity][anonymizedPhrase]
      }
    }

    return anonymizedPhrase
  }

  function isOpenAiKeyMissing(missingKeys: string[]) {
    return missingKeys.includes('OPENAI_API_KEY')
  }

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn('pb-[200px] pt-4 md:pt-10', className)}
        ref={messagesRef}
      >
        {anonymizedMessages.length || isAnonymizationLoading ? (
          <ChatList
            messages={anonymizedMessages}
            deanonymizationMapping={deanonymizationMapping}
            isAnonymizationLoading={isAnonymizationLoading}
            isChatbotResponseLoading={isChatbotResponseLoading}
            isOpenAiKeyMissing={isOpenAiKeyMissing(missingKeys)}
          />
        ) : (
          <EmptyScreen />
        )}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>
      <ChatPanel
        input={input}
        setInput={setInput}
        anonymizedMessages={anonymizedMessages}
        setAnonymizedMessages={setAnonymizedMessages}
        deanonmizationMapping={deanonymizationMapping}
        setDeanoymizationMapping={setDeanonymizationMapping}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        isAnonymizationLoading={isAnonymizationLoading}
        setIsAnonymizationLoading={setIsAnonymizationLoading}
        setIsChatbotResponseLoading={setIsChatbotResponseLoading}
      />
    </div>
  )
}
