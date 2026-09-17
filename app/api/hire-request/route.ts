import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId, candidateId, planType, notes } = await request.json()

    if (!jobId || !candidateId || !planType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['percentage', 'flat'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    // Find the application for this candidate + job
    const application = await prisma.application.findFirst({
      where: { jobId, userId: candidateId },
      orderBy: { appliedAt: 'desc' },
    })

    if (['hire_pending', 'awaiting_payment', 'hired', 'hire_cancelled'].includes(application.status)) {
  return NextResponse.json({ error: 'This application is already past hire request stage' }, { status: 400 })
}

    // Update with hire request details
    const updated = await prisma.application.update({
      where: { id: application.id },
      data: {
        status: 'hire_pending',
        hirePlan: planType,
        hireNotes: notes || null,
        hireRequestedAt: new Date(),
      },
    })

    // Notify admin(s)
    const admins = await prisma.roles.findMany({
      where: { role: { in: ['admin', 'super_admin'] } },
    })

    const job = await prisma.job.findUnique({ where: { id: jobId } })

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.user_id,
          type: 'hire_request',
          title: 'New hire request',
          message: `A client requested to hire a candidate for "${job?.title || 'a job'}" (${planType === 'percentage' ? 'One-Time %' : 'Flat Fee'})`,
          link: '/dashboard/applications',
        },
      })
    }

    return NextResponse.json({ success: true, applicationId: updated.id })
  } catch (err: any) {
    console.error('Hire request error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}