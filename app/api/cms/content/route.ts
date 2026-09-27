import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CONTENT_DEFAULTS } from '@/lib/content-defaults'

async function isAdmin(userId: string) {
  const row = await prisma.roles.findUnique({ where: { user_id: userId } })
  return row?.role === 'admin' || row?.role === 'super_admin'
}

// GET — public can read; returns DB values merged with defaults
export async function GET() {
  const rows = await prisma.siteContent.findMany()
  const map: Record<string, string> = { ...CONTENT_DEFAULTS }
  for (const r of rows) map[r.key] = r.value
  return NextResponse.json({ content: map })
}

// PUT — admin updates one or many keys
export async function PUT(request: Request) {
  const userId = await getUserId()
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const body = await request.json()
  const updates = body.updates as Record<string, string>

  if (!updates || typeof updates !== 'object') {
    return NextResponse.json({ error: 'Missing updates' }, { status: 400 })
  }

  const operations = Object.entries(updates).map(([key, value]) =>
    prisma.siteContent.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })
  )

  await prisma.$transaction(operations)

  return NextResponse.json({ success: true, count: operations.length })
}