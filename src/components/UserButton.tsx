"use client"

import { useSession, signOut } from 'next-auth/react'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuTrigger, 
    DropdownMenuItem,
    DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { useCallback } from 'react'

function UserButton() {
    const { data: session, status } = useSession()
    const user = session?.user

    const handleSignOut = useCallback(async () => {
        try {
            await signOut({ callbackUrl: '/sign-in' })
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }, [])

    // Show loading state
    if (status === "loading") {
        return <Avatar className="animate-pulse" />
    }

    // Handle no user case
    if (status === "unauthenticated" || !user) {
        return null
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <Avatar className="hover:opacity-80 transition-opacity">
                    <AvatarImage 
                        src={user.image || ''} 
                        alt={`${user.firstName || ''} ${user.lastName || ''}`} 
                    />
                    <AvatarFallback className="uppercase">
                        {(user.firstName?.[0] || '')}{(user.lastName?.[0] || '')}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">
                        {user.firstName} {user.lastName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                        {user.email}
                    </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href="/dashboard/account" className='w-full'>
                        Account
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                >
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton