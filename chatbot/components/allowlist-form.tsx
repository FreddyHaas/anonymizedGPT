'use client'

import { AllowList } from '@/components/allowlist'
import { Input } from '@/components/ui/input'
import { useAllowlist } from '@/lib/hooks/use-allowlist'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import * as React from 'react'

export function AllowlistForm() {
  const { formRef, onKeyDown } = useEnterSubmit()
  const { allowlist, setAllowlist } = useAllowlist()
  const [input, setInput] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const value = input.trim()
    setAllowlist(allowlist => [...allowlist, value])

    setInput('')
    if (!value) return
  }

  return (
    <div className="p-1">
      <form ref={formRef} onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          value={input}
          tabIndex={0}
          type="text"
          placeholder="Add word"
          onKeyDown={onKeyDown}
          onChange={e => setInput(e.target.value)}
        />
      </form>
      <div className="mt-2">
        <AllowList
          allowlist={allowlist}
          setAllowlist={setAllowlist}
        ></AllowList>
      </div>
    </div>
  )
}
