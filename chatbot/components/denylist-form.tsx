'use client'

import { Denylist } from '@/components/denylist'
import { Input } from '@/components/ui/input'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import * as React from 'react'
import { useDenylistMapping } from '../lib/hooks/use-denylist'

export const DENY_LIST_KEY = 'denylist'

export function DenylistForm() {
  const { formRef, onKeyDown } = useEnterSubmit()
  const { setDenylistMapping } = useDenylistMapping()
  const [replacement, setReplacement] = React.useState('')
  const [replacementWith, setReplacementWith] = React.useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const replace = replacement.trim()
    setReplacement('')
    if (!replace) return

    const replaceWith = replacementWith.trim()
    setReplacementWith('')

    setDenylistMapping(denylistMapping => ({
      ...denylistMapping,
      [replaceWith]: replace
    }))
  }
  return (
    <div className="p-1">
      <form ref={formRef} onSubmit={handleSubmit}>
        <Input
          value={replacement}
          tabIndex={0}
          type="text"
          placeholder="Replace"
          onKeyDown={onKeyDown}
          onChange={e => setReplacement(e.target.value)}
          className="mb-2"
        />
        <Input
          value={replacementWith}
          tabIndex={0}
          type="text"
          placeholder="With"
          onKeyDown={onKeyDown}
          onChange={e => setReplacementWith(e.target.value)}
        />
      </form>
      <div className="mt-2">
        <Denylist />
      </div>
    </div>
  )
}
