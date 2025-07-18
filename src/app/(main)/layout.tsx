import React from 'react'
import DashboardProvider from './provider'
import AppSidebar from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'

function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
        <DashboardProvider>
          <AppSidebar />  
          <main className='flex-1'>
            <AppHeader />    
            <div className='p-10'>
              {children}
            </div>
          </main>
        </DashboardProvider>
  )
}

export default DashboardLayout