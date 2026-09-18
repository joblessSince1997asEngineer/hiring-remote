import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

// PATCH — mark a message as read/unread
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
    if (!roleRow || !['admin', 'super_admin'].includes(roleRow.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, read } = await request.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await prisma.contactMessage.update({
      where: { id },
      data: { read: !!read },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}