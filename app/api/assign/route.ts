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
    })

    // *** THE FIX: AUTOMATICALLY FETCH CV URL FROM PROFILE ***
    // Check if the candidate has a CV in their Profile
    const profile = await prisma.profiles.findUnique({ where: { id: candidateId } })

    // Create or Find the Application for this candidate & job
    await prisma.application.upsert({
      where: { 
        // We need a unique key here, so we will just use the first one found
        id: (await prisma.application.findFirst({ where: { jobId, userId: candidateId } }))?.id || 'new-app'
      },
      update: {
        status: 'pending', // Reset status
        cv_url: profile?.cv_url || null, // Save the CV URL from the profile
      },
      create: {
        jobId,
        userId: candidateId, // Use the candidate's ID
        status: 'pending',
        cv_url: profile?.cv_url || null, // Save the CV URL from the profile
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Candidate already assigned to this job' }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}