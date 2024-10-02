'use client'

import * as React from 'react'

interface AnonymizedMessagesContext {
  anonymizedMessages: Array<string>
  setAnonymizedMessages: React.Dispatch<React.SetStateAction<string[]>>
}

const AnonymizedMessagesContext = React.createContext<
  AnonymizedMessagesContext | undefined
>(undefined)

export function useAnonymizedMessages() {
  const context = React.useContext(AnonymizedMessagesContext)
  if (!context) {
    throw new Error('useAllowlist must be used within an AllowlistProvider')
  }
  return context
}

interface AnonymizedMessagesProivderProps {
  children: React.ReactNode
}

export function AnonymizedMessagesProvider({
  children
}: AnonymizedMessagesProivderProps) {
  const [anonymizedMessages, setAnonymizedMessages] = React.useState<
    Array<string>
  >([])

  return (
    <AnonymizedMessagesContext.Provider
      value={{
        anonymizedMessages,
        setAnonymizedMessages
      }}
    >
      {children}
    </AnonymizedMessagesContext.Provider>
  )
}
