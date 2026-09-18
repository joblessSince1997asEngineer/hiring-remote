import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || (role.role !== 'admin' && role.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { candidateId, jobId } = await request.json()
  if (!candidateId || !jobId) {
    return NextResponse.json({ error: 'Missing candidateId or jobId' }, { status: 400 })
  }

  try {
    // 1. Get candidate's profile for CV URL
    const profile = await prisma.profiles.findUnique({ where: { id: candidateId } })

    // 2. Create or update the Application
    const existing = await prisma.application.findFirst({
      where: { jobId, userId: candidateId },
    })

    if (existing) {
      await prisma.application.update({
        where: { id: existing.id },
        data: {
          cv_url: profile?.cv_url || existing.cv_url,
        },
      })
    } else {
      await prisma.application.create({
        data: {
          jobId,
          userId: candidateId,
          status: 'pending',
          cv_url: profile?.cv_url || null,
          source: 'admin_assigned',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Assign error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}