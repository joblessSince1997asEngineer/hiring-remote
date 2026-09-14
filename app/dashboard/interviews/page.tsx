import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import InterviewsView from '@/components/InterviewsView'

export default async function InterviewsPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) redirect('/login')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role) redirect('/login')

  // Admin can always schedule. Recruiters need permission.
  const canSchedule = role.role === 'admin' || (role.role === 'recruiter' && role.allowRecruiterSchedule)

  const interviews = await prisma.interview.findMany({
    orderBy: { createdAt: 'desc' },
    include: { job: true },
  })

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Interviews</h1>
        <p className="text-slate-500">Manage and schedule all interview requests.</p>
      </div>

      <InterviewsView 
        interviews={JSON.parse(JSON.stringify(interviews))} 
        canSchedule={canSchedule}
      />
    </div>
  )
}