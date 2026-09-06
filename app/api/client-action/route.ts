import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // 2. If NO application exists, create one using the candidateId
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

    if (action === 'reject' && feedback) {
      updateData.feedback = feedback
    }

    if (action === 'hire') {
      const job = await prisma.job.findUnique({ where: { id: jobId } })
      if (job && job.salaryMax) {
        const placementFee = job.salaryMax * 0.40
        updateData.placement_fee = Math.round(placementFee)
      }
    }

    await prisma.application.update({
      where: { id: application.id },
      data: updateData,
    })

    // 4. Trigger Email Notifications
    const jobDetails = await prisma.job.findUnique({ where: { id: jobId } })

    if (action === 'interview') {
      try {
        await resend.emails.send({
          from: 'Remote Hirring <onboarding@resend.dev>',
          to: ['captainbushra179@gmail.com', 'muahmada1@gmail.com'], // ⚠️ REPLACE with real emails
          subject: `Interview Requested for ${jobDetails?.title}`,
          html: `<p>A client has requested an interview for a candidate. Please schedule the call.</p>
                 <p><strong>Job:</strong> ${jobDetails?.title}</p>
                 <p><strong>Candidate ID:</strong> ${candidateId}</p>`,
        })
      } catch (emailError) {
        console.error('Email failed to send:', emailError)
      }
    }

    if (action === 'hire') {
      try {
        const clientEmail = 'client@example.com' // ⚠️ REPLACE with the actual client email
        await resend.emails.send({
          from: 'Remote Hirring <onboarding@resend.dev>',
          to: [clientEmail],
          bcc: ['ambreenashrafofficial@gmail.com'], // ⚠️ REPLACE with Miss Ambreen's email
          subject: `Invoice Generated for ${jobDetails?.title}`,
          html: `<p>Congratulations! Your placement has been finalized.</p>
                 <p><strong>Role:</strong> ${jobDetails?.title}</p>
                 <p><strong>Placement Fee (40%):</strong> $${updateData.placement_fee}</p>
                 <p>Please log into your dashboard to view and print the invoice.</p>`,
        })
      } catch (emailError) {
        console.error('Email failed to send:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Client action error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}