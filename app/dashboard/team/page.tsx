import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TeamView from '@/components/TeamView'

export default async function TeamPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) redirect('/login')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || role.role !== 'admin') redirect('/dashboard')

  // Fetch all team members (Admins and Recruiters)
  const teamMembers = await prisma.roles.findMany({
    orderBy: { role: 'asc' },
  })

  // Attach emails
  const membersWithEmail = await Promise.all(
    teamMembers.map(async (m) => {
      const user = await prisma.user.findUnique({ where: { id: m.user_id } })
      return {
        userId: m.user_id,
        email: user?.email || 'Unknown',
        role: m.role,
        allowRecruiterSchedule: m.allowRecruiterSchedule,
        isCurrentUser: m.user_id === userId,
      }
    })
  )

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Team Management</h1>
        <p className="text-slate-500">Manage your internal team and their permissions.</p>
      </div>

      <TeamView members={JSON.parse(JSON.stringify(membersWithEmail))} />
    </div>
  )
}