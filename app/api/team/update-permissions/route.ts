import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || role.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { userId: targetUserId, allowRecruiterSchedule } = await request.json()

  try {
    await prisma.roles.update({
      where: { user_id: targetUserId },
      data: { allowRecruiterSchedule },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}