export const dynamic = 'force-dynamic'
import { getUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Briefcase, Users, FileText, Calendar, CheckSquare, DollarSign } from 'lucide-react'
import InvoiceAlert from '@/components/InvoiceAlert'
import SubscriptionCard from '@/components/SubscriptionCard'

export default async function DashboardOverview() {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRow) redirect('/login')

    const isAdmin = roleRow.role === 'admin' || roleRow.role === 'super_admin'

  // Active annual subscription — recruiter only
  const mySubscription = !isAdmin
    ? await prisma.subscription.findFirst({
        where: {
          userId,
          status: 'active',
          expiresAt: { gt: new Date() },
        },
      })
    : null

  let activeJobs = 0
  let totalCandidates = 0
  let totalApplications = 0
  let totalInterviews = 0
  let pendingApprovals = 0
  let pendingInvoices = 0
    let recentApplications: any[] = []
  let pendingInvoiceDetails: any[] = []

  if (isAdmin) {
    ;[
      activeJobs,
      totalCandidates,
      totalApplications,
      totalInterviews,
      pendingApprovals,
      pendingInvoices,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.candidateProfile.count(),
      prisma.application.count(),
      prisma.interview.count({ where: { status: 'pending' } }),
      prisma.application.count({ where: { status: 'hire_pending' } }),
      prisma.invoice.count({ where: { status: 'pending' } }),
    ])

    recentApplications = await prisma.application.findMany({
      take: 5,
      orderBy: { appliedAt: 'desc' },
      include: { job: true },
    })
  } else {
    const myJobs = await prisma.job.findMany({
      where: { recruiterId: userId },
      select: { id: true },
    })
    const myJobIds = myJobs.map(j => j.id)

    ;[
      activeJobs,
      totalApplications,
      totalInterviews,
      pendingApprovals,
      pendingInvoices,
    ] = await Promise.all([
      prisma.job.count({ where: { recruiterId: userId } }),
      prisma.application.count({ where: { jobId: { in: myJobIds } } }),
      prisma.interview.count({ where: { jobId: { in: myJobIds }, status: 'pending' } }),
      prisma.application.count({ where: { jobId: { in: myJobIds }, status: 'hire_pending' } }),
      prisma.invoice.count({
        where: {
          status: 'pending',
          application: { jobId: { in: myJobIds } },
        },
      }),
    ])
        // Fetch client's pending invoices for banner + top alert
        pendingInvoiceDetails = await prisma.invoice.findMany({
      where: {
        status: 'pending',
        application: { jobId: { in: myJobIds } },
      },
      orderBy: { dueAt: 'asc' },
    })

    const uniqueCandidates = await prisma.application.findMany({
      where: { jobId: { in: myJobIds } },
      select: { userId: true },
      distinct: ['userId'],
    })
    totalCandidates = uniqueCandidates.length

    recentApplications = await prisma.application.findMany({
      where: { jobId: { in: myJobIds } },
      take: 5,
      orderBy: { appliedAt: 'desc' },
      include: { job: true },
    })
  }

  // Enrich recent applications with candidate names
  const recentCandidateIds = [...new Set(recentApplications.map(a => a.userId))]
  const recentProfiles = await prisma.candidateProfile.findMany({
    where: { userId: { in: recentCandidateIds } },
    select: { userId: true, fullName: true },
  })
    // Fetch upcoming interviews for the current user
  // (either they're on the panel, or they requested it)
    // Fetch all scheduled upcoming interviews, then filter by user in JS
  // (Prisma can't query inside Json fields directly)
  const allUpcomingInterviews = await prisma.interview.findMany({
    where: {
      status: 'scheduled',
      scheduledDate: { gte: new Date() },
    },
    orderBy: { scheduledDate: 'asc' },
    take: 50,
    include: { job: true },
  })

  const upcomingInterviews = allUpcomingInterviews
    .filter((i) => {
      if (i.requestedByUserId === userId) return true
      const panel: string[] = Array.isArray(i.interviewers) ? (i.interviewers as string[]) : []
      return panel.includes(userId)
    })
    .slice(0, 5)

  // Enrich with candidate names
  const interviewCandidateIds = [...new Set(upcomingInterviews.map(i => i.candidateId))]
  const interviewProfiles = await prisma.candidateProfile.findMany({
    where: { userId: { in: interviewCandidateIds } },
    select: { userId: true, fullName: true },
  })

  const enrichedUpcomingInterviews = upcomingInterviews.map((i) => {
    const profile = interviewProfiles.find(p => p.userId === i.candidateId)
    const panel: string[] = Array.isArray(i.interviewers) ? i.interviewers as string[] : []
    return {
      ...i,
      candidateName: profile?.fullName || 'Unknown Candidate',
      isOnPanel: panel.includes(userId),
    }
  })

  const enrichedRecentApps = recentApplications.map((app) => {
    const profile = recentProfiles.find(p => p.userId === app.userId)
    const formData: any = app.formData
    const name = profile?.fullName || formData?.fullName || 'Unknown Candidate'
    return { ...app, candidateName: name }
  })

    const kpis = [
    {
      label: isAdmin ? 'Active Jobs' : 'My Jobs',
      value: activeJobs,
      icon: Briefcase,
      color: 'bg-blue-500',
      href: '/dashboard/jobs',
    },
    {
      label: isAdmin ? 'Candidates' : 'Candidates in My Jobs',
      value: totalCandidates,
      icon: Users,
      color: 'bg-green-500',
      href: '/dashboard/candidates',
    },
    {
      label: 'Applications',
      value: totalApplications,
      icon: FileText,
      color: 'bg-yellow-500',
      href: '/dashboard/applications',
    },
    {
      label: 'Interviews Pending',
      value: totalInterviews,
      icon: Calendar,
      color: 'bg-purple-500',
      href: '/dashboard/interviews',
    },
    // Hire Approvals — admin only (it's an admin action, not a client KPI)
    ...(isAdmin
      ? [{
          label: 'Hire Approvals',
          value: pendingApprovals,
          icon: CheckSquare,
          color: 'bg-orange-500',
          href: '/dashboard/hire-approvals',
        }]
      : []),
        {
      label: 'Invoices Due',
      value: pendingInvoices,
      icon: DollarSign,
      color: 'bg-rose-500',
      href: isAdmin ? '/dashboard/hire-approvals' : '/dashboard/applications',
    },
  ]
  return (
    <div className="p-6 md:p-10">
            {/* Payment reminder alert — client only, when unpaid invoices exist */}
      {!isAdmin && pendingInvoiceDetails && pendingInvoiceDetails.length > 0 && (
            <InvoiceAlert
          invoices={pendingInvoiceDetails.map(inv => ({
            id: inv.id,
            invoiceNumber: inv.invoiceNumber,
            amount: inv.amount,
            dueAt: inv.dueAt.toISOString(),
          }))}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Overview</h1>
        <p className="text-slate-500">Welcome back, here is what is happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Link key={kpi.label} href={kpi.href} className="no-underline">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-12 h-12 ${kpi.color} rounded-xl flex items-center justify-center mb-4 text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold text-[#0f172a] mb-1">{kpi.value}</p>
                <p className="text-sm text-slate-500">{kpi.label}</p>
              </div>
            </Link>
          )
        })}
            </div>

      {/* Annual Subscription card — client only */}
      {mySubscription && <SubscriptionCard subscription={mySubscription} />}

           {/* Upcoming Interviews Widget */}
      {enrichedUpcomingInterviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
  <h2 className="text-xl font-bold text-[#0f172a]">Upcoming Interviews</h2>
  <Link href="/dashboard/interviews" className="text-sm text-blue-600 font-medium no-underline hover:underline whitespace-nowrap">
    View All →
  </Link>
</div>

          <div className="space-y-3">
            {enrichedUpcomingInterviews.map((interview: any) => (
              <div
                key={interview.id}
                className={`p-4 rounded-xl border ${
                  interview.isOnPanel
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-[#0f172a] text-sm">
                        {interview.candidateName}
                      </p>
                      {interview.isOnPanel && (
                        <span className="text-[10px] bg-[#facc15] text-slate-900 px-2 py-0.5 rounded-full font-bold">
                          YOU&apos;RE ON PANEL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {interview.job?.title || 'Interview'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      📅 {new Date(interview.scheduledDate).toLocaleString()} • {interview.timeZone}
                    </p>
                  </div>

                  {interview.videoLink && (
                    <a
                      href={interview.videoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#0f172a] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-slate-800 transition whitespace-nowrap no-underline self-start"
                    >
                      Join Call →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Applications + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
  <h2 className="text-xl font-bold text-[#0f172a]">Recent Applications</h2>
  <Link href="/dashboard/applications" className="text-sm text-blue-600 font-medium no-underline hover:underline whitespace-nowrap">
    View All →
  </Link>
</div>

          {enrichedRecentApps.length === 0 ? (
            <p className="text-slate-400 text-sm py-8 text-center">No applications yet.</p>
          ) : (
            <div className="space-y-4">
              {enrichedRecentApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                      {app.candidateName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[#0f172a] text-sm">{app.candidateName}</p>
                      <p className="text-xs text-slate-500">Applied to: {app.job.title}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                    app.status === 'hire_pending' ? 'bg-purple-100 text-purple-700' :
                    app.status === 'awaiting_payment' ? 'bg-orange-100 text-orange-700' :
                    app.status === 'hired' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {app.status === 'hire_pending' ? 'Hire Pending' : app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#0f172a] mb-6">Quick Actions</h2>

          <div className="space-y-3">
            {isAdmin && (
              <Link href="/dashboard/post" className="block no-underline">
                <div className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold text-sm text-center hover:bg-slate-800 transition-colors">
                  + Post a New Job
                </div>
              </Link>
            )}

            {isAdmin && pendingApprovals > 0 && (
              <Link href="/dashboard/hire-approvals" className="block no-underline">
                <div className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold text-sm text-center hover:bg-orange-600 transition-colors">
                  Hire Approvals ({pendingApprovals})
                </div>
              </Link>
            )}

            <Link href="/dashboard/candidates" className="block no-underline">
              <div className="w-full bg-white border border-slate-200 text-[#0f172a] py-3 px-4 rounded-lg font-semibold text-sm text-center hover:bg-slate-50 transition-colors">
                View Talent Pool
              </div>
            </Link>

            {isAdmin && (
              <Link href="/dashboard/team" className="block no-underline">
                <div className="w-full bg-white border border-slate-200 text-[#0f172a] py-3 px-4 rounded-lg font-semibold text-sm text-center hover:bg-slate-50 transition-colors">
                  Manage Team
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}