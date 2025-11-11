import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

// List of paths that require authentication
const protectedPaths = [
  '/',  // Protect the root path
  '/dashboard',
  '/teams',
  '/tasks',
  '/projects',
  '/settings',
  '/profile',
  '/reports',
]

// List of public paths that don't require authentication
const publicPaths = [
  '/login',
  '/signup',
  '/api/auth/login',
  '/api/auth/signup',
]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('token')?.value

  // Handle login/signup pages when user is already authenticated
  if (path === '/login' || path === '/signup') {
    if (token) {
      try {
        const payload = await verifyToken(token)
        if (payload) {
          // If token is valid, redirect to home
          return NextResponse.redirect(new URL('/', request.url))
        }
      } catch (error) {
        // If token is invalid, allow access to login/signup
        return NextResponse.next()
      }
    }
    return NextResponse.next()
  }

  // Allow public paths without authentication
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next()
  }

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path === protectedPath || path.startsWith(protectedPath + '/')
  )

  if (!isProtectedPath) {
    return NextResponse.next()
  }

  if (!token) {
    // Redirect to login if no token is found
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify the token
    const payload = await verifyToken(token)
    if (!payload) {
      throw new Error('Invalid token')
    }

    // Token is valid, allow the request
    return NextResponse.next()
  } catch (error) {
    // Token is invalid, redirect to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 