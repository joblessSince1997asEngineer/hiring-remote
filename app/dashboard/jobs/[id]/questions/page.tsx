export const dynamic = 'force-dynamic'
import { getUserId } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import QuestionEditor from '@/components/QuestionEditor'

export default async function JobQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRow) redirect('/login')
  const isAdmin = roleRow.role === 'admin' || roleRow.role === 'super_admin'
  if (!isAdmin) redirect('/dashboard')

  const { id } = await params

  const job = await prisma.job.findUnique({
    where: { id },
    select: { id: true, title: true, company: true },
  })
  if (!job) notFound()

  const questions = await prisma.screeningQuestion.findMany({
    where: { jobId: id },
    orderBy: { order: 'asc' },
  })

  const serialized = questions.map(q => ({
    id: q.id,
    question: q.question,
    timeLimit: q.timeLimit,
  }))

  return (
    <div className="p-6 md:p-10">
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 no-underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Screening Questions</h1>
        <p className="text-slate-500">
          For <span className="font-medium text-slate-700">{job.title}</span>
          {job.company && <> · {job.company}</>}
        </p>
      </div>

      <QuestionEditor jobId={job.id} initialQuestions={serialized} />
    </div>
  )
}