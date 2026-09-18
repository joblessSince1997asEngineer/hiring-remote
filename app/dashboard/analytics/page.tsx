import { getUserId } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AnalyticsView from '@/components/AnalyticsView'

export default async function AnalyticsPage() {
  const cookieStore = await cookies()
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || role.role !== 'admin') redirect('/dashboard')

  // *** FETCH ALL ANALYTICS DATA ***

  // 1. Total Placements (Hired Applications)
  const totalPlacements = await prisma.application.count({
    where: { status: 'hired' },
  })

  // 2. Total Revenue (Sum of placement fees)
  const revenueResult = await prisma.application.aggregate({
    where: { status: 'hired' },
    _sum: { placement_fee: true },
  })
  const totalRevenue = revenueResult._sum.placement_fee || 0

  // 3. Total Active Clients (Client Requests approved)
  const activeClients = await prisma.client_Requests.count({
    where: { status: 'approved' },
  })

  // 4. Total Applications
  const totalApplications = await prisma.application.count()

  // 5. Applications by Status (for Pie/Bar chart)
  const applicationsByStatus = await prisma.application.groupBy({
    by: ['status'],
    _count: { _all: true },
  })

  // 6. Monthly Hires + Revenue (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)

  const recentHires = await prisma.application.findMany({
    where: {
      status: 'hired',
      appliedAt: { gte: sixMonthsAgo },
    },
    select: { appliedAt: true, placement_fee: true },
  })

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthlyData: { month: string; hires: number; revenue: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    monthlyData.push({ month: monthNames[date.getMonth()], hires: 0, revenue: 0 })
  }

  recentHires.forEach((app) => {
    const monthName = monthNames[app.appliedAt.getMonth()]
    const entry = monthlyData.find((d) => d.month === monthName)
    if (entry) {
      entry.hires += 1
      entry.revenue += app.placement_fee || 0
    }
  })

  // 7. Top Jobs by Applications
  const topJobs = await prisma.job.findMany({
    take: 5,
    orderBy: { applications: { _count: 'desc' } },
    include: { _count: { select: { applications: true } } },
  })

  // Format status data
  const statusData = applicationsByStatus.map((item) => ({
    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    count: item._count._all,
  }))

  // Ensure all statuses are present with 0 if missing
  const allStatuses = ['pending', 'shortlisted', 'hired', 'rejected']
  const completeStatusData = allStatuses.map((s) => {
    const found = statusData.find((item) => item.status.toLowerCase() === s)
    return { status: s.charAt(0).toUpperCase() + s.slice(1), count: found?.count || 0 }
  })

  const analyticsData = {
    kpis: { totalPlacements, totalRevenue, activeClients, totalApplications },
    monthlyData,
    statusData: completeStatusData,
    topJobs: topJobs.map((j) => ({ title: j.title, applications: j._count.applications })),
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Analytics</h1>
        <p className="text-slate-500">Business performance and growth insights.</p>
      </div>

      <AnalyticsView data={JSON.parse(JSON.stringify(analyticsData))} />
    </div>
  )
}