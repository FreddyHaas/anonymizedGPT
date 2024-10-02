'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { AllowlistProvider } from '@/lib/hooks/use-allowlist'
import { AnonymizedMessagesProvider } from '@/lib/hooks/use-anonymized-messages'
import { DenylistProvider } from '@/lib/hooks/use-denylist'
import { EntitiesProvider } from '@/lib/hooks/use-entities'
import { SidebarProvider } from '@/lib/hooks/use-sidebar'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { AnonymizedViewProvider } from '../lib/hooks/use-anonymized-view'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <SidebarProvider>
        <AllowlistProvider>
          <EntitiesProvider>
            <DenylistProvider>
              <AnonymizedMessagesProvider>
                <AnonymizedViewProvider>
                  <TooltipProvider>{children}</TooltipProvider>
                </AnonymizedViewProvider>
              </AnonymizedMessagesProvider>
            </DenylistProvider>
          </EntitiesProvider>
        </AllowlistProvider>
      </SidebarProvider>
    </NextThemesProvider>
  )
}
