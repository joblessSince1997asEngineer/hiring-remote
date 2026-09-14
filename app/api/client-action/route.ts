import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { jobId, applicationId, candidateId, action, feedback, clientRequestedToAttend } = await request.json()

  try {
    // 1. Find the application (prefer applicationId, else find by jobId)
    let application = null
    if (applicationId) {
      application = await prisma.application.findUnique({ where: { id: applicationId } })
    } else {
      application = await prisma.application.findFirst({
        where: { jobId: jobId },
        orderBy: { appliedAt: 'desc' },
      })
    }

    // 2. If no application exists, create one
    if (!application) {
      application = await prisma.application.create({
        data: {
          jobId,
          userId: candidateId || 'guest',
          status: 'pending',
        },
      })
    }

    // 3. Update status
    let status = ''
    if (action === 'interview') status = 'shortlisted'
    else if (action === 'reject') status = 'rejected'
    else if (action === 'hire') status = 'hired'

    const updateData: any = { status }
    if (action === 'reject' && feedback) updateData.feedback = feedback

    if (action === 'hire') {
      const job = await prisma.job.findUnique({ where: { id: jobId } })
      if (job && job.salaryMax) {
        updateData.placement_fee = Math.round(job.salaryMax * 0.40)
      }
    }

    await prisma.application.update({
      where: { id: application.id },
      data: updateData,
    })

    // 4. Create Interview Record if Requested
    const jobDetails = await prisma.job.findUnique({ where: { id: jobId } })

    if (action === 'interview') {
  // Check if an interview already exists for this application
  const existingInterview = await prisma.interview.findFirst({
    where: { 
      candidateId: application.userId,
      jobId: jobId,
    },
  })

  if (!existingInterview) {
    await prisma.interview.create({
      data: {
        applicationId: application.id,
        jobId: jobId,
        candidateId: application.userId,
        status: 'pending',
        requestedBy: 'client',
        requestedByUserId: userId,                                    // *** Save who requested ***
        clientRequestedToAttend: clientRequestedToAttend || false,    // *** Save the checkbox ***
      },
    })
  }
      try {
        await resend.emails.send({
          from: 'Remote Hirring <onboarding@resend.dev>',
          to: ['admin@example.com'],
          subject: `Interview Requested for ${jobDetails?.title}`,
          html: `<p>An interview has been requested for ${jobDetails?.title}.</p>`,
        })
      } catch (emailError) {
        console.error('Email failed:', emailError)
      }
    }

    if (action === 'hire') {
      try {
        await resend.emails.send({
          from: 'Remote Hirring <onboarding@resend.dev>',
          to: ['client@example.com'],
          bcc: ['ambreen@example.com'],
          subject: `Invoice Generated for ${jobDetails?.title}`,
          html: `<p>Placement Fee: $${updateData.placement_fee}</p>`,
        })
      } catch (emailError) {
        console.error('Email failed:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Client action error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}