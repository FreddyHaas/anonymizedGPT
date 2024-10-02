'use server'

import {
  CancelablePromise,
  postChatbotMessageMessagesAnonymizePost,
  PostChatbotMessageMessagesAnonymizePostResponse
} from '@/lib/anonymized-chat-api-client'
import { ChatbotMessage, DeanyonmizationMapping } from '@/lib/types'
import OpenAI from 'openai'

export async function getMissingKeys() {
  const keysRequired = ['OPENAI_API_KEY']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}

export async function requestChatbot(
  chatbotMessages: Array<ChatbotMessage>
): Promise<ChatbotMessage> {
  if (process.env['MOCK_REQUEST_TO_OPENAI'] === 'true') {
    const lastContent = chatbotMessages[chatbotMessages.length - 1]?.content
    const content = lastContent !== undefined ? lastContent : ''

    return new Promise(resolve => {
      return setTimeout(
        () =>
          resolve({
            role: 'assistant',
            content
          }),
        1000
      )
    })
  }

  const openaiModel = process.env['OPENAI_MODEL']

  if (openaiModel === '' || openaiModel === undefined)
    throw new Error(
      'OpenAI model not defined. Please set in environment variables'
    )

  const openai = new OpenAI()

  const completion = await openai.chat.completions.create({
    model: openaiModel,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...chatbotMessages
    ]
  })

  const content = completion.choices[0].message.content

  if (content === null) {
    throw Error('Error loading chatbot response: response was null')
  }

  return {
    role: 'assistant',
    content
  }
}

export async function anonymizeMessages(
  originalMessages: ChatbotMessage[],
  allowlist: string[],
  entities: string[],
  deanonymizationMapping: DeanyonmizationMapping
): CancelablePromise<PostChatbotMessageMessagesAnonymizePostResponse> {
  return postChatbotMessageMessagesAnonymizePost({
    requestBody: {
      original_messages: originalMessages,
      deanonymization_mapping: deanonymizationMapping,
      allow_list: allowlist,
      entities
    }
  })
}
