import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api'

export { default } from 'next-auth/middleware';

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/sign-in',
    '/sign-up',
    '/verify/:path*'
  ],
}
 
// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const token = await getToken({ req: request })
  const url = request.nextUrl

  // Create Convex client for checking admin status
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

  // Redirect authenticated users away from auth pages
  if(token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') 
  )) {
    // Check if token contains valid user data (not invalidated)
    if(token._id && token._id !== "") {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  // Protect dashboard routes
  if(!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  // Check for invalidated sessions on dashboard routes
  if(token && url.pathname.startsWith('/dashboard')) {
    // If session exists but user ID is empty (invalidated), redirect to sign in
    if(!token._id || token._id === "") {
      console.log('Redirecting user with invalidated session to sign-in')
      return NextResponse.redirect(new URL('/sign-in?message=session-expired', request.url))
    }
  }

  // Protect admin routes
  if(url.pathname.startsWith('/admin') && !url.pathname.includes('/setup')) {
    // Redirect unauthenticated users to sign in
    if(!token || !token._id || token._id === "") {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
    
    try {
      // Check if user is admin
      const isAdmin = await convex.query(api.admin.isUserAdmin, {
        userId: token._id
      })
      
      if(!isAdmin) {
        // Redirect non-admin users to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      // Redirect to dashboard on error
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
}
