import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import dns from 'dns'

// Force IPv4 — fixes Windows Node fetch timeout to Cloudflare/Supabase Storage
dns.setDefaultResultOrder('ipv4first')

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  const isAdmin = roleRow?.role === 'admin' || roleRow?.role === 'super_admin'
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { responseId } = await request.json()
    if (!responseId) return NextResponse.json({ error: 'Missing responseId' }, { status: 400 })

    const response = await prisma.screeningResponse.findUnique({
      where: { id: responseId },
    })
    if (!response) return NextResponse.json({ error: 'Response not found' }, { status: 404 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 })
    }

    // Call Supabase Storage REST API directly — no SDK, no undici
    const apiUrl = `${url}/storage/v1/object/sign/screening-videos/${response.videoUrl}`
    console.log('[get-video-url] calling', apiUrl)

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiresIn: 3600 }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[get-video-url] storage error', res.status, errText)
      return NextResponse.json(
        { error: `Storage error (${res.status}): ${errText}` },
        { status: 500 }
      )
    }

    const data = await res.json()
    const signedUrl = `${url}/storage/v1${data.signedURL}`
    console.log('[get-video-url] SUCCESS')

    return NextResponse.json({ url: signedUrl })
  } catch (err: any) {
    console.error('[get-video-url] caught error:', err?.message)
    return NextResponse.json(
      { error: err?.message || 'Server error' },
      { status: 500 }
    )
  }
}