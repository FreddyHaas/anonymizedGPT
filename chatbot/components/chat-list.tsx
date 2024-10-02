import { Separator } from '@/components/ui/separator'
import { ChatbotMessage, DeanyonmizationMapping } from '@/lib/types'
import { useAnonymizedView } from '../lib/hooks/use-anonymized-view'
import {
  AnonymizedText,
  BotMessage,
  BotSpinnerMessage,
  UserMessage,
  UserSpinnerMessage
} from './message/message'

export interface ChatList {
  messages: Array<ChatbotMessage>
  deanonymizationMapping: DeanyonmizationMapping
  isAnonymizationLoading: Boolean
  isChatbotResponseLoading: Boolean
  isOpenAiKeyMissing: boolean
}

export function ChatList({
  messages,
  deanonymizationMapping,
  isAnonymizationLoading,
  isChatbotResponseLoading,
}: ChatList) {
  const { anonymizedView, setAnonymizedView } = useAnonymizedView()

  if (!messages.length && !isAnonymizationLoading) {
    return null
  }

  const renderMessage = (message: ChatbotMessage) => {
    if (message.role === 'user') {
      return (
        <UserMessage>
          <AnonymizedText
            anonymizedText={message.content}
            deanonymizerMapping={deanonymizationMapping}
            anonymizedView={anonymizedView}
            setAnonymizedView={setAnonymizedView}
          ></AnonymizedText>
        </UserMessage>
      )
    }

    if (message.role === 'assistant') {
      return (
        <BotMessage
          content={message.content}
          deanonymizerMapping={deanonymizationMapping}
          anonymizedView={anonymizedView}
          setAnonymizedView={setAnonymizedView}
        ></BotMessage>
      )
    }
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          {renderMessage(message)}
          {isAnonymizationLoading || isChatbotResponseLoading ? (
            <Separator className="my-4" />
          ) : (
            index < messages.length - 1 && <Separator className="my-4" />
          )}
        </div>
      ))}
      {isAnonymizationLoading && <UserSpinnerMessage />}
      {isChatbotResponseLoading && <BotSpinnerMessage />}
    </div>
  )
}
