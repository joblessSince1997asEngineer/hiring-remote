import { getUserId } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function DashboardJobsPage() {
  const cookieStore = await cookies()
  const userId = await getUserId()
  if (!userId) redirect('/login')

  // *** FETCH THE ROLE ***
  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role) redirect('/login')

  const jobs = await prisma.job.findMany({
    orderBy: { postedAt: 'desc' },
    include: { _count: { select: { applications: true } } },
  })

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Jobs</h1>
          <p className="text-slate-500">Manage all posted jobs.</p>
        </div>
        
        {/* *** SHOW ONLY FOR ADMIN *** */}
        {role.role === 'admin' && (
          <Link href="/dashboard/post" className="no-underline">
            <button className="bg-black text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-slate-800 transition">
              <Plus className="w-4 h-4" /> Post New Job
            </button>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Job Title</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Company</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Location</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Applicants</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Posted</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">No jobs posted yet.</td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-[#0f172a] text-sm">{job.title}</td>
                    <td className="p-4 text-slate-600 text-sm">{job.company}</td>
                    <td className="p-4 text-slate-600 text-sm">{job.location}</td>
                    <td className="p-4 text-slate-600 text-sm">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs">{job.type}</span>
                    </td>
                    <td className="p-4 text-slate-600 text-sm font-medium">{job._count.applications}</td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(job.postedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Link href={`/jobs/${job.id}`} className="text-blue-600 text-sm font-medium no-underline hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}