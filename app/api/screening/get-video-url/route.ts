import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { persistSession: false } }
)

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

    const { data, error } = await supabaseAdmin.storage
      .from('screening-videos')
      .createSignedUrl(response.videoUrl, 3600) // 1 hour

    if (error) throw error

    return NextResponse.json({ url: data.signedUrl })
  } catch (err: any) {
    console.error('get-video-url error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}