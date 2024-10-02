'use client'

import { IconClose } from '@/components/ui/icons'
import { Button } from './ui/button'

export function AllowList({
  allowlist,
  setAllowlist
}: {
  allowlist: string[]
  setAllowlist: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const handleDelete = (index: number) => {
    setAllowlist(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex w-full flex-wrap gap-1">
      {allowlist.map((item, index) => (
        <div
          key={index}
          className="flex items-center border rounded-md max-w-full"
        >
          <p className="text-sm px-2 py-1 overflow-hidden text-ellipsis text-greenhighlight">
            {item}
          </p>
          <Button
            variant="ghost"
            size="flex"
            onClick={() => handleDelete(index)}
          >
            <IconClose />
          </Button>
        </div>
      ))}
    </div>
  )
}
