export const dynamic = 'force-dynamic'
import { getUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Eye, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default async function ScreeningsPage() {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRow) redirect('/login')
  const isAdmin = roleRow.role === 'admin' || roleRow.role === 'super_admin'
  if (!isAdmin) redirect('/dashboard')

  const pending = await prisma.application.findMany({
    where: { screeningStatus: 'submitted' },
    orderBy: { screeningSubmittedAt: 'desc' },
    include: { job: { select: { title: true, company: true } } },
  })

  const reviewed = await prisma.application.findMany({
    where: { screeningStatus: { in: ['approved', 'rejected'] } },
    orderBy: { screeningReviewedAt: 'desc' },
    take: 20,
    include: { job: { select: { title: true, company: true } } },
  })

  // Candidate emails for display
  const userIds = [...new Set([...pending, ...reviewed].map(a => a.userId))]
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true },
  })
  const emailMap = new Map(users.map(u => [u.id, u.email]))

  function CandidateRow({ app, showStatus }: { app: any; showStatus: boolean }) {
    const email = emailMap.get(app.userId) ?? app.userId.slice(0, 8)
    const statusStyle =
      app.screeningStatus === 'approved'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : app.screeningStatus === 'rejected'
        ? 'bg-red-50 text-red-700 border-red-200'
        : 'bg-amber-50 text-amber-700 border-amber-200'

    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h3 className="font-bold text-[#0f172a] text-base truncate">
                {app.job?.title || 'Unknown job'}
              </h3>
              {showStatus && (
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${statusStyle}`}>
                  {app.screeningStatus}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 truncate">{app.job?.company}</p>
            <p className="text-xs text-slate-400 mt-1 truncate">{email}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Submitted{' '}
                {app.screeningSubmittedAt
                  ? new Date(app.screeningSubmittedAt).toLocaleDateString()
                  : '—'}
              </span>
            </div>
          </div>

          <Link
            href={`/dashboard/screenings/${app.id}`}
            className="inline-flex items-center gap-1.5 bg-[#0f172a] text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition no-underline self-start md:self-auto"
          >
            <Eye className="w-4 h-4" /> Review
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Video Screenings</h1>
        <p className="text-slate-500">
          Review candidate video responses and approve or reject.
        </p>
      </div>

      {/* Pending */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h2 className="text-lg font-bold text-[#0f172a]">
            Awaiting Review
            <span className="ml-2 text-sm font-normal text-slate-400">
              ({pending.length})
            </span>
          </h2>
        </div>

        {pending.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-slate-500">All caught up — no pending screenings.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(app => (
              <CandidateRow key={app.id} app={app} showStatus={false} />
            ))}
          </div>
        )}
      </div>

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-[#0f172a] mb-4">
            Recently Reviewed
            <span className="ml-2 text-sm font-normal text-slate-400">
              ({reviewed.length})
            </span>
          </h2>
          <div className="space-y-3">
            {reviewed.map(app => (
              <CandidateRow key={app.id} app={app} showStatus={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}