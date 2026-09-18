import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
    if (!roleRow) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const isAdmin = roleRow.role === 'admin' || roleRow.role === 'super_admin'

    const { interviewId } = await request.json()
    if (!interviewId) return NextResponse.json({ error: 'Missing interviewId' }, { status: 400 })

    const interview = await prisma.interview.findUnique({ where: { id: interviewId } })
    if (!interview) return NextResponse.json({ error: 'Interview not found' }, { status: 404 })

    // Can't cancel a completed interview
    if (interview.status === 'completed') {
      return NextResponse.json({ error: 'Cannot cancel a completed interview' }, { status: 400 })
    }

    // Can't cancel an already-cancelled interview
    if (interview.status === 'cancelled') {
      return NextResponse.json({ error: 'Interview is already cancelled' }, { status: 400 })
    }

    // Client can only cancel their own requests
    if (!isAdmin && interview.requestedByUserId !== userId) {
      return NextResponse.json({ error: 'You can only cancel interviews you requested' }, { status: 403 })
    }

    // Update status
    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'cancelled' },
    })

    // Notify the other party
    const notifyUserId = isAdmin ? interview.requestedByUserId : null
    if (notifyUserId) {
      await prisma.notification.create({
        data: {
          userId: notifyUserId,
          type: 'interview_cancelled',
          title: 'Interview cancelled',
          message: 'An interview you requested has been cancelled by admin.',
          link: '/dashboard/interviews',
        },
      })
    }

    // If admin cancelled, notify all admins too (so they're aware)
    if (!isAdmin) {
      const admins = await prisma.roles.findMany({
        where: { role: { in: ['admin', 'super_admin'] } },
      })
      for (const a of admins) {
        await prisma.notification.create({
          data: {
            userId: a.user_id,
            type: 'interview_cancelled',
            title: 'Interview cancelled by client',
            message: 'A client cancelled their interview request.',
            link: '/dashboard/interviews',
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Interview cancel error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}