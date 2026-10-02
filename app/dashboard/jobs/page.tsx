import { getUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Briefcase, MapPin, Users, Clock, ArrowRight } from 'lucide-react'

export default async function DashboardJobsPage() {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRow) redirect('/login')

  const isAdmin = roleRow.role === 'admin' || roleRow.role === 'super_admin'

  const jobs = await prisma.job.findMany({
    where: isAdmin ? {} : { recruiterId: userId },
    orderBy: { postedAt: 'desc' },
    include: { _count: { select: { applications: true } } },
  })

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-1">
            {isAdmin ? 'Jobs' : 'My Jobs'}
          </h1>
          <p className="text-slate-500">
            {isAdmin ? 'Manage all posted jobs.' : 'Jobs you have posted.'}
          </p>
        </div>

        {isAdmin && (
          <Link href="/dashboard/post" className="no-underline">
            <button className="bg-black text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-slate-800 transition whitespace-nowrap">
              <Plus className="w-4 h-4" /> Post New Job
            </button>
          </Link>
        )}
      </div>

      {/* Counter */}
      {jobs.length > 0 && (
        <p className="text-sm text-slate-500 mb-4">
          {jobs.length} job{jobs.length === 1 ? '' : 's'}
        </p>
      )}

      {/* Empty state */}
      {jobs.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm mb-4">
            {isAdmin ? 'No jobs posted yet.' : 'You have no jobs yet.'}
          </p>
          {isAdmin && (
            <Link
              href="/dashboard/post"
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-800 transition no-underline"
            >
              <Plus className="w-4 h-4" /> Post your first job
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                {/* Left: Title + company + meta */}
                <div className="flex-1 min-w-0">
                  {/* Row 1: title + type */}
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-bold text-[#0f172a] text-base truncate">
                      {job.title}
                    </h3>
                    <span className="shrink-0 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide">
                      {job.type}
                    </span>
                  </div>

                  {/* Row 2: company */}
                  <p className="text-sm text-slate-500 truncate mb-2">
                    {job.company}
                  </p>

                  {/* Row 3: meta */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {job._count.applications} applicant
                      {job._count.applications === 1 ? '' : 's'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Posted {new Date(job.postedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 shrink-0 md:self-center self-start">
                  <Link
                    href={`/dashboard/applications?jobId=${job.id}`}
                    className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold no-underline transition-colors"
                  >
                    Applicants
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href={`/dashboard/jobs/${job.id}/questions`}
                    className="inline-flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3.5 py-2 rounded-lg text-xs font-semibold no-underline transition-colors"
                  >
                    Questions
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}