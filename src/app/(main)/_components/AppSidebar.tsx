"use client"

import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Gem, HomeIcon, LucideFile, Search, WalletCards } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MenuItems = [
    {
        label: 'Home',
        icon: HomeIcon,
        link: '/dashboard'
    },
    {
        label: 'New Video',
        icon: LucideFile,
        link: '/dashboard/create-new-video'
    },
    {
        label: 'Explore',
        icon: Search,
        link: '#'
    },
    {
        label: 'Billing',
        icon: WalletCards,
        link: '#'
    }
]

function AppSidebar() {
  const path = usePathname();
  const { data: session, status } = useSession()
  const user = session?.user
  return (
     <Sidebar>
      <SidebarHeader>
        <div>
            <div className='flex items-center gap-3 w-full justify-center'>
                <Image src="/logo.svg" alt="logo" width={40} height={40} />
                <h2>Video Gen</h2>
            </div>
            <h2 className='text-lg text-gray-400 text-center mt-3'>
                AI Shorts Generator
            </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
            <SidebarGroupContent>
                <div className='mx-5 mt-8'>
                    <Link href={'/dashboard/create-new-video'}>
                    <Button className='w-full'>+ Create New Video</Button>
                    </Link>
                </div>
                <SidebarMenu >
                    {MenuItems.map((item, index) => (
                        <SidebarMenuItem key={index} className='mt-3 mx-5'>
                            <SidebarMenuButton isActive={path === item.link} className='p-5'>
                                <Link href={item.link} className='flex items-center gap-4 p-3'>
                                    <item.icon className='mr-2' />
                                    {item.label}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
         <div className='p-5 border rounded-lg mb-6 bg-gray-800  '>
            <div className='flex items-center justify-between'>
                <Gem className='text-gray-400'/>
                <h2 className='text-gray-400'>{user && user.credits} {user && user.credits === 1 ? "Credit" : "Credits"}</h2>
            </div>
            <Button className='w-full mt-3'>Buy More Credits</Button>
         </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar