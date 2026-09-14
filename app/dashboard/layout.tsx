import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardSidebar from '@/components/DashboardSidebar'
import DashboardTopBar from '@/components/DashboardTopBar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) redirect('/login')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || (role.role !== 'admin' && role.role !== 'recruiter')) {
    redirect('/unauthorized')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardSidebar role={role.role} />

      {/* Content pushes to the right of the sidebar on desktop */}
      <div className="md:ml-64">
        <DashboardTopBar />
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}