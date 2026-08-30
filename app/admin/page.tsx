import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSearch from '@/components/AdminSearch'

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) redirect('/login')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || (role.role !== 'admin' && role.role !== 'super_admin')) {
    redirect('/unauthorized')
  }

  // Fetch jobs to show in the dropdown
  const jobs = await prisma.job.findMany({ orderBy: { postedAt: 'desc' } })

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Talent Pool</h1>
      <AdminSearch initialJobs={jobs} />
    </div>
  )
}