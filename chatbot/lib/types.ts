import { Message as ApiMessage } from '@/lib/anonymized-chat-api-client'

export type Message = ApiMessage & {
  id: string
}

export type ChatbotMessage = {
  role: 'user' | 'system' | 'assistant'
  content: string
}

export type DeanyonmizationMapping = {
  [key: string]: { [key: string]: string }
}

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface DenylistMapping {
  [key: string]: string
}
