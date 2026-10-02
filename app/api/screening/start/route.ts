import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const userId = await getUserId()
  if (!userId) return null
  const row = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!row) return null
  if (row.role !== 'admin' && row.role !== 'super_admin') return null
  return userId
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const { applicationId } = await request.json()
    if (!applicationId) {
      return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 })
    }

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    })
    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

    // Must have questions defined
    const qCount = await prisma.screeningQuestion.count({
      where: { jobId: app.jobId },
    })
    if (qCount === 0) {
      return NextResponse.json(
        { error: 'No screening questions defined for this job. Add them first.' },
        { status: 400 }
      )
    }

    // Don't override existing progress
    if (app.screeningStatus && app.screeningStatus !== 'rejected') {
      return NextResponse.json(
        { error: `Screening already ${app.screeningStatus}` },
        { status: 400 }
      )
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: {
        screeningStatus: 'pending',
        screeningStartedAt: new Date(),
        screeningSubmittedAt: null,
        screeningReviewedAt: null,
        screeningReviewedBy: null,
        screeningNotes: null,
      },
    })

    // Bell notify candidate
    await prisma.notification.create({
      data: {
        userId: app.userId,
        type: 'screening_invite',
        title: 'Video screening requested',
        message: `Please complete a short video screening for "${app.job?.title || 'a role'}". Takes ~5 minutes.`,
        link: '/account',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('screening start error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}