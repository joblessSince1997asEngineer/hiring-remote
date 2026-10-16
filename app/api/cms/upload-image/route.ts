import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import dns from 'dns'

dns.setDefaultResultOrder('ipv4first')

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

async function requireAdmin() {
  const userId = await getUserId()
  if (!userId) return null
  const row = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!row) return null
  if (row.role !== 'admin' && row.role !== 'super_admin') return null
  return userId
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PNG, JPG, WEBP, or GIF allowed' },
        { status: 400 }
      )
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large (max 5 MB)' },
        { status: 400 }
      )
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json(
        { error: 'Supabase credentials missing' },
        { status: 500 }
      )
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabaseAdmin = createClient(url, key, {
      auth: { persistSession: false },
    })

    // Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const baseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9-]/gi, '-')
      .toLowerCase()
      .slice(0, 40)
    const filename = `${Date.now()}-${baseName}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from('public-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('[upload-image] upload error:', uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('public-images')
      .getPublicUrl(filename)

    console.log('[upload-image] uploaded:', urlData.publicUrl)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err: any) {
    console.error('[upload-image] error:', err)
    return NextResponse.json(
      { error: err?.message || 'Server error' },
      { status: 500 }
    )
  }
}