import { getUserId } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardShell from '@/components/DashboardShell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || (role.role !== 'admin' && role.role !== 'recruiter')) {
    redirect('/unauthorized')
  }

  return <DashboardShell role={role.role}>{children}</DashboardShell>
}