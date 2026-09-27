import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function isAdmin(userId: string) {
  const row = await prisma.roles.findUnique({ where: { user_id: userId } })
  return row?.role === 'admin' || row?.role === 'super_admin'
}

// GET — public sees active only; admin sees all
export async function GET() {
  const userId = await getUserId()
  let admin = false
  if (userId) admin = await isAdmin(userId)

  const members = await prisma.teamMember.findMany({
    where: admin ? {} : { active: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })

  return NextResponse.json({ members })
}

// POST — create (admin only)
export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const body = await request.json()
  const { name, role, bio, imageUrl, order, active } = body

  if (!name || !role || !bio) {
    return NextResponse.json({ error: 'Name, role, and bio are required' }, { status: 400 })
  }

  const member = await prisma.teamMember.create({
    data: {
      name,
      role,
      bio,
      imageUrl: imageUrl || null,
      order: typeof order === 'number' ? order : 0,
      active: active !== false,
    },
  })

  return NextResponse.json({ success: true, member })
}