import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { jobId, candidateId, action, feedback } = await request.json()

  try {
    // 1. Look for the application
    let application = await prisma.application.findFirst({
      where: { jobId: jobId },
      orderBy: { appliedAt: 'desc' }
    })

    // 2. If NO application exists, we create one using the candidateId
    if (!application) {
      application = await prisma.application.create({
        data: {
          jobId: jobId,
          userId: candidateId || 'guest',
          status: 'pending',
        },
      })
    }

    // 3. Update the status based on the action
    let status = ''
    if (action === 'interview') status = 'shortlisted'
    else if (action === 'reject') status = 'rejected'
    else if (action === 'hire') status = 'hired'

    const updateData: any = { status }

    // 4. Add feedback if rejecting
    if (action === 'reject' && feedback) {
      updateData.feedback = feedback
    }

    // 5. If Hiring, calculate the 40% placement fee
    if (action === 'hire') {
      // Get the job to read the expected salary
      const job = await prisma.job.findUnique({ where: { id: jobId } })
      if (job && job.salaryMax) {
        // 40% fee calculation based on Max Salary
        const placementFee = job.salaryMax * 0.40
        updateData.placement_fee = Math.round(placementFee)
      }
    }

    // 6. Final update
    await prisma.application.update({
      where: { id: application.id },
      data: updateData,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Client action error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}