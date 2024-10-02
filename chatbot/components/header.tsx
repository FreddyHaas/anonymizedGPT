import * as React from 'react'
import { AnonymizationSettings } from './anonymization-settings'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <SidebarMobile>
        <div className="pt-8">
          <AnonymizationSettings />
        </div>
      </SidebarMobile>
      <SidebarToggle />
      <div className="flex items-center justify-end space-x-2">{children}</div>
    </header>
  )
}
