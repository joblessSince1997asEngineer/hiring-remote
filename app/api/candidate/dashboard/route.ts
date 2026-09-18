import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Get all applications by this user
    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { appliedAt: 'desc' },
      include: { job: true },
    })

    // Get all interviews for this user
    const interviews = await prisma.interview.findMany({
      where: { candidateId: userId },
      orderBy: { createdAt: 'desc' },
      include: { job: true },
    })

    return NextResponse.json({
      user: { id: user.id, email: user.email, role: user.role },
      applications: JSON.parse(JSON.stringify(applications)),
      interviews: JSON.parse(JSON.stringify(interviews)),
    })
  } catch (err: any) {
    console.error('Candidate dashboard error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}