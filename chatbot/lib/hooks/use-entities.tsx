'use client'

import { loadFromLocalStorage, saveInLocalStorage } from '@/lib/utils'
import * as React from 'react'

interface EntitiesContext {
  entities: Array<string>
  setEntities: React.Dispatch<React.SetStateAction<string[]>>
}

const EntitiesContext = React.createContext<EntitiesContext | undefined>(
  undefined
)

export function useEntities() {
  const context = React.useContext(EntitiesContext)
  if (!context) {
    throw new Error('useEntities must be used within a Provider')
  }
  return context
}

interface EntitiesProviderProps {
  children: React.ReactNode
}

export function EntitiesProvider({ children }: EntitiesProviderProps) {
  const lastValue = loadFromLocalStorage('entities')

  const defaultEntities = [
    'CREDIT_CARD',
    'CRYPTO',
    'DATE_TIME',
    'EMAIL_ADDRESS',
    'IBAN_CODE',
    'IP_ADDRESS',
    'LOCATION',
    'PERSON',
    'PHONE_NUMBER',
    'URL'
  ]

  const initial = lastValue === null ? defaultEntities : JSON.parse(lastValue)

  const [entities, _setEntities] = React.useState<Array<string>>(initial)

  function setEntities(value: React.SetStateAction<string[]>): void {
    _setEntities(prevState => {
      const newValue = typeof value === 'function' ? value(prevState) : value
      saveInLocalStorage('entities', JSON.stringify(newValue))
      return newValue
    })
  }

  return (
    <EntitiesContext.Provider value={{ entities, setEntities }}>
      {children}
    </EntitiesContext.Provider>
  )
}
