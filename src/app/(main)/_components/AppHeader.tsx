import { SidebarTrigger } from '@/components/ui/sidebar'
import UserButton from '@/components/UserButton'
import React from 'react'

function AppHeader() {
  return (
    <div className='p-3 flex items-center justify-between'>
        <SidebarTrigger />
        <UserButton />
    </div>
  )
}

export default AppHeader