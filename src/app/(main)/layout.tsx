import React from 'react'
import DashboardProvider from './provider'
import AppSidebar from './_components/AppSidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'

function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
        <DashboardProvider>
          <AppSidebar />  
          <main>
            <SidebarTrigger />  
            {children}
          </main>
        </DashboardProvider>
  )
}

export default DashboardLayout