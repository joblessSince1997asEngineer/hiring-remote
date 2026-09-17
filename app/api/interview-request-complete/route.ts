import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { interviewId } = await request.json()
    if (!interviewId) return NextResponse.json({ error: 'Missing interviewId' }, { status: 400 })

    const interview = await prisma.interview.findUnique({ where: { id: interviewId } })
    if (!interview) return NextResponse.json({ error: 'Interview not found' }, { status: 404 })

    if (interview.status === 'completed') {
      return NextResponse.json({ error: 'Interview already completed' }, { status: 400 })
    }

    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'completion_requested' },
    })

    // Notify all admins
    const admins = await prisma.roles.findMany({
      where: { role: { in: ['admin', 'super_admin'] } },
    })

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.user_id,
          type: 'interview_completion_requested',
          title: 'Interview completion requested',
          message: `Client marked an interview as done. Confirm to unlock hire.`,
          link: '/dashboard/interviews',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Interview completion request error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}