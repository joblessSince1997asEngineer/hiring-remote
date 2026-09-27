import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  // 1. Auth check
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Admin check — allow admin AND super_admin
  const roleRec = await prisma.roles.findUnique({
    where: { user_id: userId },
  })
  if (!roleRec || roleRec.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 3. Filter range (7d / 30d / 90d / all)
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || 'all'

  let since: Date | null = null
  const now = new Date()
  if (range === '7d') since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  if (range === '30d') since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  if (range === '90d') since = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  // 4. Fetch everything in parallel
  const [
    jobsCount,
    candidatesCount,
    applicationsCount,
    interviewsCount,
    hiresCount,
    revenueAgg,
    applicationsForChart,
    hiresForChart,
    jobsByCategory,
  ] = await Promise.all([
    // KPI: Jobs
    prisma.job.count({
      where: since ? { postedAt: { gte: since } } : {},
    }),

    // KPI: Candidates (filtered by date range too)
    prisma.candidateProfile.count({
      where: since ? { createdAt: { gte: since } } : {},
    }),

    // KPI: Applications
    prisma.application.count({
      where: since ? { appliedAt: { gte: since } } : {},
    }),

    // KPI: Interviews — use createdAt (scheduledDate is nullable for pending)
    prisma.interview.count({
      where: since ? { createdAt: { gte: since } } : {},
    }),

    // KPI: Hires
    prisma.application.count({
      where: {
        status: 'hired',
        ...(since ? { appliedAt: { gte: since } } : {}),
      },
    }),

    // KPI: Revenue (sum of Invoice.amount where status = 'paid')
    prisma.invoice.aggregate({
      where: {
        status: 'paid',
        ...(since ? { paidAt: { gte: since } } : {}),
      },
      _sum: { amount: true },
    }),

    // Line chart data: applications over time
    prisma.application.findMany({
      where: since ? { appliedAt: { gte: since } } : {},
      select: { appliedAt: true },
      orderBy: { appliedAt: 'asc' },
    }),

    // Bar chart data: hires per month
    prisma.application.findMany({
      where: {
        status: 'hired',
        ...(since ? { appliedAt: { gte: since } } : {}),
      },
      select: { appliedAt: true },
      orderBy: { appliedAt: 'asc' },
    }),

    // Pie chart data: jobs by category
    prisma.job.groupBy({
      by: ['category'],
      _count: { id: true },
      where: since ? { postedAt: { gte: since } } : {},
    }),
  ])

  // 5. Group applications by date (YYYY-MM-DD)
  const applicationsByDate: Record<string, number> = {}
  applicationsForChart.forEach((a) => {
    const key = new Date(a.appliedAt).toISOString().split('T')[0]
    applicationsByDate[key] = (applicationsByDate[key] || 0) + 1
  })
  const applicationsOverTime = Object.entries(applicationsByDate).map(
    ([date, count]) => ({ date, count })
  )

  // 6. Group hires by month (YYYY-MM)
  const hiresByMonth: Record<string, number> = {}
  hiresForChart.forEach((h) => {
    const d = new Date(h.appliedAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    hiresByMonth[key] = (hiresByMonth[key] || 0) + 1
  })
  const hiresPerMonth = Object.entries(hiresByMonth).map(([month, count]) => ({
    month,
    count,
  }))

  // 7. Jobs by category for pie chart
  const categories = jobsByCategory.map((g) => ({
    category: g.category || 'Uncategorized',
    count: g._count.id,
  }))

  // 8. Conversion rate = (hires / applications) * 100
  const conversionRate =
    applicationsCount > 0
      ? parseFloat(((hiresCount / applicationsCount) * 100).toFixed(1))
      : 0

  return NextResponse.json({
    kpi: {
      jobs: jobsCount,
      candidates: candidatesCount,
      applications: applicationsCount,
      interviews: interviewsCount,
      hires: hiresCount,
      revenue: revenueAgg._sum.amount || 0,
      conversionRate,
    },
    applicationsOverTime,
    hiresPerMonth,
    categories,
  })
}