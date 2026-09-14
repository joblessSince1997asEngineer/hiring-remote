import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch all admins and recruiters as potential interviewers
  const teamMembers = await prisma.roles.findMany({
    where: {
      role: { in: ['admin', 'recruiter'] },
      NOT: { role: 'suspended' },
    },
  })

  // For each team member, get their email
  const membersWithEmail = await Promise.all(
    teamMembers.map(async (m) => {
      const user = await prisma.user.findUnique({ where: { id: m.user_id } })
      return {
        userId: m.user_id,
        role: m.role,
        email: user?.email || 'unknown',
      }
    })
  )

  return NextResponse.json({ members: membersWithEmail })
}