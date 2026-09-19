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
  const isAdmin = role === 'admin' || role === 'super_admin'

  const params = await searchParams
  const filterJobId = params.jobId || null

  // Build the where clause based on role
  const where: any = {}

  if (!isAdmin) {
    // Client sees only applications for THEIR jobs
    const myJobs = await prisma.job.findMany({
      where: { recruiterId: userId },
      select: { id: true },
    })
    const myJobIds = myJobs.map(j => j.id)

    // If admin filtered by a specific job, respect that
    if (filterJobId) {
      // Make sure it's actually their job
      if (myJobIds.includes(filterJobId)) {
        where.jobId = filterJobId
      } else {
        where.jobId = { in: [] } // no results
      }
    } else {
      where.jobId = { in: myJobIds }
    }
  } else if (filterJobId) {
    where.jobId = filterJobId
  }

  const applications = await prisma.application.findMany({
    where,
    orderBy: { appliedAt: 'desc' },
    include: { job: true },
  })

  // Only fetch interviews/profiles for these applications
  const appIds = applications.map(a => a.id)
  const candidateIds = [...new Set(applications.map(a => a.userId))]

  const [interviews, profiles] = await Promise.all([
    prisma.interview.findMany({ where: { applicationId: { in: appIds } } }),
    prisma.candidateProfile.findMany({ where: { userId: { in: candidateIds } } }),
  ])

    // Title comes from loaded applications — safe because we already filtered by role.
  // If client has no access, `applications` is empty, so no title leaks.
  const job = filterJobId && applications.length > 0 ? applications[0].job : null

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">
          {filterJobId ? `Applicants for: ${job?.title || 'Unknown Job'}` : 'Applications'}
        </h1>
        <p className="text-slate-500">
          {isAdmin
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