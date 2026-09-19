import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — fetch the current user's notifications + unread count
export async function GET() {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.notification.count({
        where: { userId, read: false },
      }),
    ])

    return NextResponse.json({ notifications, unreadCount })
  } catch (err: any) {
    console.error('Notifications GET error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

// PATCH — mark one or all notifications as read
export async function PATCH(request: Request) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, all } = await request.json()

    if (all) {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      })
      return NextResponse.json({ success: true })
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id or all flag' }, { status: 400 })
    }

    // Only allow marking YOUR OWN notification
    const notification = await prisma.notification.findUnique({ where: { id } })
    if (!notification || notification.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Notifications PATCH error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}