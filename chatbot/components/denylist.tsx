'use client'

import { IconClose } from '@/components/ui/icons'
import { Separator } from '@/components/ui/separator'
import { useDenylistMapping } from '@/lib/hooks/use-denylist'
import { Button } from './ui/button'

export function Denylist() {
  const { denylistMapping, setDenylistMapping } = useDenylistMapping()

  const handleDelete = (replacedWord: string) => {
    setDenylistMapping(denylistMapping => {
      delete denylistMapping[replacedWord]

      return {
        ...denylistMapping
      }
    })
  }

  const replaceWithWords = Object.keys(denylistMapping)

  return (
    <div className="flex w-full flex-wrap gap-1">
      {replaceWithWords.map((replaceWithWord, index) => (
        <div
          key={index}
          className="flex items-center border rounded-md max-w-full"
        >
          <div className="flex flex-col px-3 py-2">
            <p className="text-sm overflow-hidden text-ellipsis text-red-500">
              {denylistMapping[replaceWithWord]}
            </p>
            <Separator className="my-1" />
            <p className="text-sm overflow-hidden text-ellipsis text-greenhighlight">
              {replaceWithWord}
            </p>
          </div>
          <Button
            variant="ghost"
            size="flex"
            onClick={() => handleDelete(replaceWithWord)}
          >
            <IconClose />
          </Button>
        </div>
      ))}
    </div>
  )
}
