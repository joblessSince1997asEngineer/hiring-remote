import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || (role.role !== 'admin' && role.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { candidateId, jobId } = await request.json()

  try {
    // Create the Assignment
    await prisma.job_Assignments.create({
      data: { candidate_id: candidateId, job_id: jobId },
    });

    // ALSO create an Application record so Clients have a CV to view
    await prisma.application.create({
      data: {
        jobId: jobId,
        userId: candidateId, // Link it to the candidate's ID
        status: 'pending',
        cv_url: (await prisma.profiles.findUnique({ where: { id: candidateId } }))?.cv_url || null,
      },
    });

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Candidate already assigned to this job' }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}