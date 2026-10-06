export const dynamic = 'force-dynamic'
import { getUserId } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ScreeningReview from '@/components/ScreeningReview'

export default async function ScreeningReviewPage({
  params,
}: {
  params: Promise<{ applicationId: string }>
}) {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRow) redirect('/login')
  const isAdmin = roleRow.role === 'admin' || roleRow.role === 'super_admin'
  if (!isAdmin) redirect('/dashboard')

  const { applicationId } = await params

  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: { select: { title: true, company: true } },
      screeningResponses: {
        include: { question: { select: { question: true, order: true } } },
        orderBy: { question: { order: 'asc' } },
      },
    },
  })

  if (!app) notFound()

  const candidate = await prisma.user.findUnique({
    where: { id: app.userId },
    select: { email: true, id: true },
  })

  const serialized = {
    id: app.id,
    screeningStatus: app.screeningStatus,
    screeningNotes: app.screeningNotes,
    screeningSubmittedAt: app.screeningSubmittedAt?.toISOString() ?? null,
    screeningReviewedAt: app.screeningReviewedAt?.toISOString() ?? null,
    jobTitle: app.job?.title || 'Unknown role',
    jobCompany: app.job?.company || '',
    candidateEmail: candidate?.email || app.userId.slice(0, 8),
    responses: app.screeningResponses.map(r => ({
      id: r.id,
      question: r.question.question,
      order: r.question.order,
      duration: r.duration,
      tabSwitches: r.tabSwitches,
      submittedAt: r.submittedAt.toISOString(),
    })),
  }

  return (
    <div className="p-6 md:p-10">
      <Link
        href="/dashboard/screenings"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 no-underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Screenings
      </Link>

      <ScreeningReview application={serialized} />
    </div>
  )
}