import { getUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Clock, CheckCircle2, XCircle } from 'lucide-react'

export default async function MyRequestsPage() {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) redirect('/login')

  // Show requests where userId matches OR contact_email matches (for guests who signed up later)
  const requests = await prisma.client_Requests.findMany({
    where: {
      OR: [
        { userId },
        { contact_email: user.email },
      ],
    },
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-start mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-1">My Hiring Requests</h1>
          <p className="text-slate-500">Track your submitted requests and their status.</p>
        </div>
        <Link href="/request-job" className="no-underline">
          <button className="bg-black text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-slate-800 transition">
            <Plus className="w-4 h-4" /> New Request
          </button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-6">You haven't submitted any hiring requests yet.</p>
          <Link href="/request-job" className="no-underline">
            <button className="bg-black text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-slate-800 transition">
              Submit Your First Request
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const statusConfig = {
              pending_review: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
              approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
              rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
            }[req.status] || { label: req.status, color: 'bg-slate-100 text-slate-700', icon: Clock }

            const Icon = statusConfig.icon

            return (
              <div key={req.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-[#0f172a] text-lg mb-1">{req.role_title}</h2>
                    <p className="text-slate-600 text-sm mb-1">{req.company_name}</p>
                    <p className="text-slate-400 text-xs">
                      Submitted {new Date(req.created_at).toLocaleDateString()} • {req.currency} {req.budget_min?.toLocaleString()}–{req.budget_max?.toLocaleString()} / {req.budgetPeriod}
                    </p>
                  </div>

                  <span className={`self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${statusConfig.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {req.seniority && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Level</p>
                      <p className="text-slate-700 capitalize">{req.seniority}</p>
                    </div>
                  )}
                  {req.remoteType && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Mode</p>
                      <p className="text-slate-700 capitalize">{req.remoteType}</p>
                    </div>
                  )}
                  {req.location && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Location</p>
                      <p className="text-slate-700">{req.location}</p>
                    </div>
                  )}
                  {req.urgency && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Urgency</p>
                      <p className="text-slate-700 capitalize">{req.urgency}</p>
                    </div>
                  )}
                </div>

                {req.tech_stack?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 uppercase mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {req.tech_stack.map((skill: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {req.status === 'approved' && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <Link href="/dashboard/jobs" className="text-blue-600 text-sm font-medium no-underline hover:underline">
                      View the live job post →
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}