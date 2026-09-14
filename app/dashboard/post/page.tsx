import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PostJobForm } from '@/components/PostJobForm'

export default async function PostJobPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) redirect('/login')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  // If not an admin, kick them back to the dashboard overview
  if (!role || role.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold mb-6 text-slate-900">Post a New Role</h1>
        <PostJobForm />
      </div>
    </div>
  )
}