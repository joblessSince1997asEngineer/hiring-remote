import { getUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PostJobForm } from '@/components/PostJobForm'

export default async function PostJobPage() {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || !['admin', 'super_admin'].includes(role.role)) {
    redirect('/dashboard')
  }

  // Fetch all client accounts (recruiters) for the ownership dropdown
  const clients = await prisma.user.findMany({
    where: { role: 'recruiter' },
    select: { id: true, email: true },
    orderBy: { email: 'asc' },
  })

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold mb-6 text-slate-900">Post a New Role</h1>
        <PostJobForm clients={clients} />
      </div>
    </div>
  )
}