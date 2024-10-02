'use client'

import { loadFromLocalStorage, saveInLocalStorage } from '@/lib/utils'
import * as React from 'react'

interface AllowlistContext {
  allowlist: Array<string>
  setAllowlist: React.Dispatch<React.SetStateAction<string[]>>
}

const AllowlistContext = React.createContext<AllowlistContext | undefined>(
  undefined
)

export function useAllowlist() {
  const context = React.useContext(AllowlistContext)
  if (!context) {
    throw new Error('useAllowlist must be used within a Provider')
  }
  return context
}

interface AllowlistProviderProps {
  children: React.ReactNode
}

export function AllowlistProvider({ children }: AllowlistProviderProps) {
  const lastValue = loadFromLocalStorage('allowlist')

  const initial = lastValue === null ? [] : JSON.parse(lastValue)

  const [allowlist, _setAllowlist] = React.useState<Array<string>>(initial)

  function setAllowlist(value: React.SetStateAction<string[]>): void {
    _setAllowlist(prevState => {
      const newValue = typeof value === 'function' ? value(prevState) : value
      saveInLocalStorage('allowlist', JSON.stringify(newValue))
      return newValue
    })
  }

  return (
    <AllowlistContext.Provider value={{ allowlist, setAllowlist }}>
      {children}
    </AllowlistContext.Provider>
  )
}
