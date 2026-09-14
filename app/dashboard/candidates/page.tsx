import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CandidatesTable from '@/components/CandidatesTable'

export default async function CandidatesPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) redirect('/login')

  // Fetch all jobs to populate the assign dropdown
  const jobs = await prisma.job.findMany({
    orderBy: { postedAt: 'desc' },
    select: { id: true, title: true },
  })

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Candidates</h1>
        <p className="text-slate-500">Search and assign candidates from the global talent pool.</p>
      </div>

      <CandidatesTable initialJobs={jobs} />
    </div>
  )
}