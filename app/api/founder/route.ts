import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const cookieStore = await cookies()
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || role.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [activeJobs, totalApplications, pendingApplications] = await Promise.all([
    prisma.job.count(),
    prisma.application.count(),
    prisma.application.count({ where: { status: 'pending' } }),
  ])

  return NextResponse.json({ activeJobs, totalApplications, pendingApplications })
}