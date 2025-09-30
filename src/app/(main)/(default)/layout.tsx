import React from 'react'
import DashboardProvider from './provider'
import AppSidebar from '../_components/AppSidebar'
import AppHeader from '../_components/AppHeader'
import { SessionUpdater } from "@/components/layout/SessionUpdater"

function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
        <DashboardProvider>
          <SessionUpdater />
          <AppSidebar />  
          <main className='flex-1 flex flex-col'>
            <AppHeader />    
            <div className='p-10 flex-1'>
              {children}
            </div>
          </main>
        </DashboardProvider>
  )
}

export default DashboardLayout
