import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { interviewId } = await request.json()
    if (!interviewId) return NextResponse.json({ error: 'Missing interviewId' }, { status: 400 })

    const interview = await prisma.interview.findUnique({ where: { id: interviewId } })
    if (!interview) return NextResponse.json({ error: 'Interview not found' }, { status: 404 })

    if (interview.status === 'completed') {
      return NextResponse.json({ error: 'Interview already completed' }, { status: 400 })
    }

    // Permission check: admin OR on the panel OR requested it
    const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
    const isAdmin = roleRow?.role === 'admin'

    const panel: string[] = Array.isArray(interview.interviewers)
      ? (interview.interviewers as string[])
      : []
    const isOnPanel = panel.includes(userId)
    const isRequester = interview.requestedByUserId === userId

    if (!isAdmin && !isOnPanel && !isRequester) {
      return NextResponse.json(
        { error: 'Only the admin, panel members, or the requester can mark this complete' },
        { status: 403 }
      )
    }

    // Mark complete
    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'completed' },
    })

    // Notify everyone involved (except the person who just did it)
    const notifyIds = new Set<string>()

    if (interview.candidateId && interview.candidateId !== userId) {
      notifyIds.add(interview.candidateId)
    }

    for (const memberId of panel) {
      if (memberId !== userId) notifyIds.add(memberId)
    }

    if (interview.requestedByUserId && interview.requestedByUserId !== userId) {
      notifyIds.add(interview.requestedByUserId)
    }

    // All admins
    const admins = await prisma.roles.findMany({
      where: { role: 'admin' },
    })
    for (const a of admins) {
      if (a.user_id !== userId) notifyIds.add(a.user_id)
    }

    for (const notifyId of notifyIds) {
      await prisma.notification.create({
        data: {
          userId: notifyId,
          type: 'interview_completed',
          title: 'Interview marked complete',
          message: `The interview has been marked complete. Hire can now be requested.`,
          link: '/dashboard/interviews',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Interview complete error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}