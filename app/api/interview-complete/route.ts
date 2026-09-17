import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify admin
    const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
    if (!roleRow || !['admin', 'super_admin'].includes(roleRow.role)) {
      return NextResponse.json({ error: 'Only admin can confirm completion' }, { status: 403 })
    }

    const { interviewId } = await request.json()
    if (!interviewId) return NextResponse.json({ error: 'Missing interviewId' }, { status: 400 })

    const interview = await prisma.interview.findUnique({ where: { id: interviewId } })
    if (!interview) return NextResponse.json({ error: 'Interview not found' }, { status: 404 })

    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'completed' },
    })

    // Notify the client (whoever requested)
    if (interview.requestedByUserId) {
      await prisma.notification.create({
        data: {
          userId: interview.requestedByUserId,
          type: 'interview_completed',
          title: 'Interview confirmed complete',
          message: 'Admin confirmed the interview. You can now request a hire.',
          link: '/dashboard/applications',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Interview complete error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}