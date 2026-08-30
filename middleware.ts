import { NextResponse } from 'next/server'

export function middleware(request: Request) {
  // Allow POST requests (form submissions) to pass through without redirecting
  if (request.method !== 'GET') {
    return NextResponse.next()
  }

  const userId = request.headers.get('cookie')?.includes('userId')
  const { pathname } = new URL(request.url)

  // Protect the dashboard and recruiter routes for normal navigation
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/recruiter')) && !userId) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*', '/recruiter/:path*'] }