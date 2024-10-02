'use client'

import { loadFromLocalStorage, saveInLocalStorage } from '@/lib/utils'
import * as React from 'react'

interface AnonymizedViewContext {
  anonymizedView: Boolean
  setAnonymizedView: React.Dispatch<React.SetStateAction<Boolean>>
}

const AnonymizedViewContext = React.createContext<
  AnonymizedViewContext | undefined
>(undefined)

export function useAnonymizedView() {
  const context = React.useContext(AnonymizedViewContext)
  if (!context) {
    throw new Error('useAnonymizedView must be used within a Provider')
  }
  return context
}

interface AnonymizedViewProviderProps {
  children: React.ReactNode
}

export function AnonymizedViewProvider({
  children
}: AnonymizedViewProviderProps) {
  const lastValue = loadFromLocalStorage('view')

  const initial = lastValue === null ? true : JSON.parse(lastValue)

  const [anonymizedView, _setAnonymizedView] = React.useState<Boolean>(initial)

  function setAnonymizedView(value: React.SetStateAction<Boolean>): void {
    _setAnonymizedView(prevState => {
      const newValue = typeof value === 'function' ? value(prevState) : value
      saveInLocalStorage('view', JSON.stringify(newValue))
      return newValue
    })
  }

  return (
    <AnonymizedViewContext.Provider
      value={{
        anonymizedView,
        setAnonymizedView
      }}
    >
      {children}
    </AnonymizedViewContext.Provider>
  )
}
