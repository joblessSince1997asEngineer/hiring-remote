import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import FounderDashboard from '@/components/FounderDashboard'

export default async function FounderPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) redirect('/login')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || role.role !== 'super_admin') redirect('/unauthorized')

  const [activeJobs, totalApplications, pendingApplications] = await Promise.all([
    prisma.job.count(),
    prisma.application.count(),
    prisma.application.count({ where: { status: 'pending' } }),
  ])

  const stats = { activeJobs, totalApplications, pendingApplications }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Founder Dashboard</h1>
      <a href="/founder/admins" className="block mb-4 text-blue-600 font-medium hover:underline">Manage Admin Accounts</a>
      <FounderDashboard stats={stats} />
    </div>
  )
}