'use client'

import { DenylistMapping } from '@/lib/types'
import * as React from 'react'
import { loadFromLocalStorage, saveInLocalStorage } from '../utils'

interface DenylistContext {
  denylistMapping: DenylistMapping
  setDenylistMapping: React.Dispatch<React.SetStateAction<DenylistMapping>>
}

const DenylistContext = React.createContext<DenylistContext | undefined>(
  undefined
)

export function useDenylistMapping() {
  const context = React.useContext(DenylistContext)
  if (!context) {
    throw new Error('useDenylistMapping must be used within a Provider')
  }
  return context
}

interface DenylistMappingProviderProps {
  children: React.ReactNode
}

export function DenylistProvider({ children }: DenylistMappingProviderProps) {
  const lastValue = loadFromLocalStorage('denylist')

  const initial = lastValue === null ? {} : JSON.parse(lastValue)

  const [denylistMapping, _setDenylistMapping] =
    React.useState<DenylistMapping>(initial)

  function setDenylistMapping(value: React.SetStateAction<{}>): void {
    _setDenylistMapping(prevState => {
      const newValue = typeof value === 'function' ? value(prevState) : value
      saveInLocalStorage('denylist', JSON.stringify(newValue))
      return newValue
    })
  }

  return (
    <DenylistContext.Provider
      value={{
        denylistMapping,
        setDenylistMapping
      }}
    >
      {children}
    </DenylistContext.Provider>
  )
}
