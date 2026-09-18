import { getUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ApplicationsView from '@/components/ApplicationsView'

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>
}) {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  const role = roleRow?.role || 'candidate'

  const params = await searchParams
  const filterJobId = params.jobId || null

  const applications = await prisma.application.findMany({
    where: filterJobId ? { jobId: filterJobId } : {},
    orderBy: { appliedAt: 'desc' },
    include: { job: true },
  })

  const interviews = await prisma.interview.findMany()

  const candidateIds = [...new Set(applications.map(a => a.userId))]
  const profiles = await prisma.candidateProfile.findMany({
    where: { userId: { in: candidateIds } },
  })

  const job = filterJobId
    ? await prisma.job.findUnique({ where: { id: filterJobId }, select: { title: true } })
    : null

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">
          {filterJobId ? `Applicants for: ${job?.title || 'Unknown Job'}` : 'Applications'}
        </h1>
        <p className="text-slate-500">
          {role === 'admin'
            ? 'Review incoming applications and take action.'
            : 'Review candidates and request hires.'}
        </p>
      </div>

      <ApplicationsView
        applications={JSON.parse(JSON.stringify(applications))}
        interviews={JSON.parse(JSON.stringify(interviews))}
        profiles={JSON.parse(JSON.stringify(profiles))}
        role={role}
      />
    </div>
  )
}