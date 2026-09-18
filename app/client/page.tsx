import { getUserId } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ClientDashboard from '@/components/ClientDashboard'

export default async function ClientPage() {
  const cookieStore = await cookies()
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || (role.role !== 'recruiter' && role.role !== 'admin' && role.role !== 'super_admin')) {
    redirect('/unauthorized')
  }

  const jobs = await prisma.job.findMany({
    where: { recruiterId: userId },
    include: {
      assignments: {
        include: {
          candidate: {
            select: {
              id: true,
              full_name: true,
              primary_skill: true,
              years_exp: true,
              expected_salary: true,
              timezone: true,
              cv_url: true // *** ADDED THIS LINE ***
            }
          }
        }
      },
      applications: {
        select: {
          id: true,
          status: true,
          userId: true,
          cv_url: true
        }
      }
    }
  })

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Client Dashboard</h1>
      <ClientDashboard jobs={jobs} />
    </div>
  )
}