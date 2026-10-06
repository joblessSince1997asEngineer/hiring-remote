export const dynamic = 'force-dynamic'
import { getUserId } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ScreeningFlow from '@/components/ScreeningFlow'

export default async function ScreeningPage({
  params,
}: {
  params: Promise<{ applicationId: string }>
}) {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const { applicationId } = await params

  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: { select: { id: true, title: true, company: true } },
    },
  })

  if (!app) notFound()
  if (app.userId !== userId) redirect('/account')

  // Not yet invited, or already done — bounce back
  if (app.screeningStatus !== 'pending') {
    redirect('/account')
  }

  const questions = await prisma.screeningQuestion.findMany({
    where: { jobId: app.jobId },
    orderBy: { order: 'asc' },
    select: { id: true, question: true, timeLimit: true },
  })

  if (questions.length === 0) {
    redirect('/account')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 md:py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-1">
            Video Screening
          </h1>
          <p className="text-sm text-slate-500">
            {app.job?.title}
            {app.job?.company && <> · {app.job.company}</>}
          </p>
        </div>

        <ScreeningFlow
          applicationId={applicationId}
          questions={questions}
        />
      </div>
    </div>
  )
}