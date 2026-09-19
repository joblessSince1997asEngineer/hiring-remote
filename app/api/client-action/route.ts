import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email-send'

export async function POST(request: Request) {
  const userId = await getUserId()
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

    // 4. Fetch job details for notifications
    const jobDetails = await prisma.job.findUnique({ where: { id: jobId } })

    // 5. Handle interview request
    if (action === 'interview') {
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
            requestedByUserId: userId,
            clientRequestedToAttend: clientRequestedToAttend || false,
          },
        })
      }

      // Notify admin
      await sendEmail({
        to: 'hr@remotehirring.com',
        subject: `Interview Requested — ${jobDetails?.title || 'Job'}`,
        title: 'Interview Requested',
        greeting: 'Hi,',
        body: `
          <p>An interview has been requested for the following role:</p>
          <p><strong>${jobDetails?.title || 'Untitled Job'}</strong></p>
          <p style="color:#64748b;font-size:13px;">
            Log in to the dashboard to schedule the interview.
          </p>
        `,
        buttonText: 'View Interviews',
        buttonUrl: 'https://hiring-remote.vercel.app/dashboard/interviews',
      })
    }

    // 6. Handle hire — generate invoice notification
    if (action === 'hire') {
      const placementFee = updateData.placement_fee || 0

      // Find the client who owns this job (recruiterId on Job)
      let clientEmail: string | null = null
      if (jobDetails?.recruiterId) {
        const client = await prisma.user.findUnique({ where: { id: jobDetails.recruiterId } })
        clientEmail = client?.email || null
      }

      // Send invoice email — to admin + client (if we have their email)
      const recipients = ['hr@remotehirring.com']
      if (clientEmail) recipients.push(clientEmail)

      await sendEmail({
        to: recipients,
        subject: `Invoice Generated — ${jobDetails?.title || 'Job'}`,
        title: 'Invoice Generated',
        greeting: 'Hi,',
        body: `
          <p>A placement fee invoice has been generated for:</p>
          <p><strong>${jobDetails?.title || 'Untitled Job'}</strong></p>
          <p style="font-size:24px;font-weight:800;color:#0f172a;margin:24px 0;">
            $${placementFee.toLocaleString()}
          </p>
          <p style="color:#64748b;font-size:13px;">
            Payment is due within 15 days.
          </p>
        `,
        buttonText: 'View Invoice',
        buttonUrl: 'https://hiring-remote.vercel.app/dashboard/hire-approvals',
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Client action error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}