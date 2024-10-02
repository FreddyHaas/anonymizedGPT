'use client'

import { cn } from '@/lib/utils'
import { useAnonymizedView } from '../lib/hooks/use-anonymized-view'
import { buttonVariants } from './ui/button'
import { IconEyeClosed, IconEyeOpen } from './ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function ToggleView() {
  const { anonymizedView, setAnonymizedView } = useAnonymizedView()

  function toggleAnonymized() {
    setAnonymizedView(prevState => !prevState)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className={cn(buttonVariants())} onClick={toggleAnonymized}>
          {anonymizedView ? (
            <IconEyeClosed className="size-5" />
          ) : (
            <IconEyeOpen className="size-5" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="mr-4">
        Toggle between viewing original and anonymized messages
      </TooltipContent>
    </Tooltip>
  )
}
