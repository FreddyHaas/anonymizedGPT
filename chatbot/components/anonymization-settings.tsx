import { AllowlistForm } from '@/components/allowlist-form'
import { EntitiesSelector } from '@/components/entities-selector'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { IconCheck, IconCross, IconCrosshair } from '@/components/ui/icons'
import { DenylistForm } from './denylist-form'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export async function AnonymizationSettings() {
  return (
    <div className="flex flex-col h-full overflow-auto p-2">
      <Accordion type="multiple" defaultValue={['item-1']}>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <IconCrosshair className="size-3" />
                  <span className="pl-2">Entities to anonymize</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                What should be anonymized?
              </TooltipContent>
            </Tooltip>
          </AccordionTrigger>
          <AccordionContent>
            <EntitiesSelector />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <IconCheck className="size-3" />
                  <span className="pl-2">Allow list</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Words that are detected as sensible but should be allowed
              </TooltipContent>
            </Tooltip>
          </AccordionTrigger>
          <AccordionContent>
            <AllowlistForm />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <IconCross className="size-3" />
                  <span className="pl-2">Deny list</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Words that are not detected as sensible but should be replaced
              </TooltipContent>
            </Tooltip>
          </AccordionTrigger>
          <AccordionContent>
            <DenylistForm />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* @ts-ignore */}
      <div className="flex items-center justify-between p-4 absolute bottom-0 right-0">
        <ThemeToggle />
      </div>
    </div>
  )
}
