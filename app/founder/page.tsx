import { getUserId } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import FounderDashboard from '@/components/FounderDashboard'

export default async function FounderPage() {
  const cookieStore = await cookies()
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || role.role !== 'super_admin') redirect('/unauthorized')

  // Fetch stats server-side
  const [activeJobs, totalApplications, pendingApplications] = await Promise.all([
    prisma.job.count(),
    prisma.application.count(),
    prisma.application.count({ where: { status: 'pending' } }),
  ])

  // Calculate last 6 months data for the chart
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)

  const recentHires = await prisma.application.findMany({
    where: {
      status: 'hired',
      appliedAt: { gte: sixMonthsAgo }
    },
    select: { appliedAt: true }
  })

  // Group by month name
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const chartData: { month: string; hires: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    chartData.push({ month: monthNames[date.getMonth()], hires: 0 })
  }

  recentHires.forEach((app) => {
    const appMonth = monthNames[app.appliedAt.getMonth()]
    const monthEntry = chartData.find((entry) => entry.month === appMonth)
    if (monthEntry) monthEntry.hires += 1
  })

  const stats = { activeJobs, totalApplications, pendingApplications }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Founder Dashboard</h1>
      <FounderDashboard stats={stats} chartData={chartData} />
    </div>
  )
}