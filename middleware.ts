import { NextResponse } from 'next/server'

export function middleware(request: Request) {
  if (request.method !== 'GET') return NextResponse.next()

  const userId = request.headers.get('cookie')?.includes('userId')
  const { pathname } = new URL(request.url)

  // Block internal routes if user isn't logged in
  if ((pathname.startsWith('/admin') || pathname.startsWith('/client') || pathname.startsWith('/founder')) && !userId) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/client/:path*', '/founder/:path*'] }