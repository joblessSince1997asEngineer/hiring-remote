import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function isAdmin(userId: string) {
  const row = await prisma.roles.findUnique({ where: { user_id: userId } })
  return row?.role === 'admin' || row?.role === 'super_admin'
}

// PATCH — update (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId()
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  const data: any = {}
  if (typeof body.name === 'string') data.name = body.name
  if (typeof body.role === 'string') data.role = body.role
  if (typeof body.bio === 'string') data.bio = body.bio
  if ('imageUrl' in body) data.imageUrl = body.imageUrl || null
  if (typeof body.order === 'number') data.order = body.order
  if (typeof body.active === 'boolean') data.active = body.active

  try {
    const member = await prisma.teamMember.update({ where: { id }, data })
    return NextResponse.json({ success: true, member })
  } catch {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }
}

// DELETE — remove (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId()
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { id } = await params

  try {
    await prisma.teamMember.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }
}