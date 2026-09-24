import { getUserId } from '@/lib/auth'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import HireApprovalsView from '@/components/HireApprovalsView'

export default async function HireApprovalsPage() {
  
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRow || !['admin', 'super_admin'].includes(roleRow.role)) {
    redirect('/unauthorized')
  }

  const applications = await prisma.application.findMany({
    where: { status: 'hire_pending' },
    orderBy: { hireRequestedAt: 'desc' },
    include: { job: true },
  })

  const candidateIds = [...new Set(applications.map(a => a.userId))]
  const profiles = await prisma.candidateProfile.findMany({
    where: { userId: { in: candidateIds } },
  })

  const users = await prisma.user.findMany({
    where: { id: { in: candidateIds } },
    select: { id: true, email: true },
  })

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Hire Approvals</h1>
        <p className="text-slate-500">Review hire requests from clients and generate invoices.</p>
      </div>

      <HireApprovalsView
        applications={JSON.parse(JSON.stringify(applications))}
        profiles={JSON.parse(JSON.stringify(profiles))}
        users={JSON.parse(JSON.stringify(users))}
      />
    </div>
  )
}