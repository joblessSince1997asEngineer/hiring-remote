import { getUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import InterviewsView from '@/components/InterviewsView'

export default async function InterviewsPage() {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRow) redirect('/login')

  const isAdmin = roleRow.role === 'admin' || roleRow.role === 'super_admin'
  const canSchedule = isAdmin || (roleRow.role === 'recruiter' && roleRow.allowRecruiterSchedule)

  // Build filter: admin sees all, client sees only their jobs' interviews
  let whereClause: any = {}

  if (!isAdmin) {
    const myJobs = await prisma.job.findMany({
      where: { recruiterId: userId },
      select: { id: true },
    })
    whereClause.jobId = { in: myJobs.map(j => j.id) }
  }

  const interviews = await prisma.interview.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: { job: true },
  })

  // Enrich with candidate name + email
  const candidateIds = [...new Set(interviews.map(i => i.candidateId))]

  const [users, profiles] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: candidateIds } },
      select: { id: true, email: true },
    }),
    prisma.candidateProfile.findMany({
      where: { userId: { in: candidateIds } },
      select: { userId: true, fullName: true },
    }),
  ])

  const enrichedInterviews = interviews.map((i) => {
    const u = users.find(x => x.id === i.candidateId)
    const p = profiles.find(x => x.userId === i.candidateId)
    return {
      ...i,
      candidateName: p?.fullName || u?.email?.split('@')[0] || 'Unknown Candidate',
      candidateEmail: u?.email || null,
    }
  })

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Interviews</h1>
        <p className="text-slate-500">
          {isAdmin ? 'Manage and schedule all interview requests.' : 'Interviews for your jobs.'}
        </p>
      </div>

      <InterviewsView
        interviews={JSON.parse(JSON.stringify(enrichedInterviews))}
        canSchedule={canSchedule}
        role={roleRow.role}
      />
    </div>
  )
}