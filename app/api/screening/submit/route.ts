import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { applicationId, responses } = await request.json() as {
      applicationId?: string
      responses?: Array<{ questionId: string; path: string; duration: number; tabSwitches: number }>
    }

    if (!applicationId) return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 })
    if (!Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json({ error: 'Missing responses' }, { status: 400 })
    }

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    })
    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    if (app.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (app.screeningStatus !== 'pending') {
      return NextResponse.json({ error: 'Screening not active' }, { status: 400 })
    }

    // Verify all questions are answered
    const totalQuestions = await prisma.screeningQuestion.count({
      where: { jobId: app.jobId },
    })
    if (responses.length !== totalQuestions) {
      return NextResponse.json(
        { error: `Expected ${totalQuestions} responses, got ${responses.length}` },
        { status: 400 }
      )
    }

    // Save responses + update app in a transaction
    await prisma.$transaction([
      ...responses.map(r =>
        prisma.screeningResponse.upsert({
          where: {
            applicationId_questionId: {
              applicationId,
              questionId: r.questionId,
            },
          },
          create: {
            applicationId,
            questionId: r.questionId,
            videoUrl: r.path,
            duration: Math.round(r.duration || 0),
            tabSwitches: r.tabSwitches || 0,
          },
          update: {
            videoUrl: r.path,
            duration: Math.round(r.duration || 0),
            tabSwitches: r.tabSwitches || 0,
          },
        })
      ),
      prisma.application.update({
        where: { id: applicationId },
        data: {
          screeningStatus: 'submitted',
          screeningSubmittedAt: new Date(),
        },
      }),
    ])

    // Notify admins
    const admins = await prisma.roles.findMany({ where: { role: 'admin' } })
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.user_id,
          type: 'screening_submitted',
          title: 'Screening submitted',
          message: `A candidate submitted a video screening for "${app.job?.title || 'a role'}". Review when ready.`,
          link: '/dashboard/screenings',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('screening submit error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}