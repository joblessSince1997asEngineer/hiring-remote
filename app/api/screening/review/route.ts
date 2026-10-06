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
    const { applicationId, decision, notes } = await request.json() as {
      applicationId?: string
      decision?: 'approved' | 'rejected'
      notes?: string
    }

    if (!applicationId) return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 })
    if (decision !== 'approved' && decision !== 'rejected') {
      return NextResponse.json({ error: 'decision must be approved or rejected' }, { status: 400 })
    }

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    })
    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    if (app.screeningStatus !== 'submitted') {
      return NextResponse.json(
        { error: `Cannot review — status is "${app.screeningStatus}"` },
        { status: 400 }
      )
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: {
        screeningStatus: decision,
        screeningReviewedAt: new Date(),
        screeningReviewedBy: admin,
        screeningNotes: notes?.trim() || null,
      },
    })

    // Notify candidate
    await prisma.notification.create({
      data: {
        userId: app.userId,
        type: decision === 'approved' ? 'screening_approved' : 'screening_rejected',
        title: decision === 'approved' ? 'Screening passed ✓' : 'Screening update',
        message:
          decision === 'approved'
            ? `Your video screening for "${app.job?.title || 'the role'}" was approved. We'll contact you about the next step.`
            : `Your video screening for "${app.job?.title || 'the role'}" was not selected to move forward. Thank you for your time.`,
        link: '/account',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('screening review error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}