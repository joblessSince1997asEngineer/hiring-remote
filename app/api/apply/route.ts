import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/email-send'

export async function POST(request: Request) {
  // Rate limit: 10 applications per IP per hour
  const ip = getClientIp(request)
  const rl = rateLimit(`apply:${ip}`, 10, 60 * 60 * 1000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Too many applications. Please try again in ${Math.ceil(rl.retryAfterSeconds / 60)} min.` },
      { status: 429 }
    )
  }

  // Require login to apply
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Please log in to apply' }, { status: 401 })
  }

  const { jobId, formData } = await request.json()

  if (!jobId || !formData) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // 1. Verify job exists
    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // 2. Prevent duplicate applications
    const existing = await prisma.application.findFirst({
      where: { jobId, userId },
    })
    if (existing) {
      return NextResponse.json({ error: 'You have already applied to this job' }, { status: 400 })
    }

    // 3. Save the application
    const application = await prisma.application.create({
      data: {
        jobId,
        userId,
        coverLetter: formData.coverLetter || '',
        cv_url: formData.cv_url || null,
        formData: formData,
        status: 'pending',
        source: 'self_applied',
      },
    })

    // 4. Get user + profile info for emails
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const profile = await prisma.candidateProfile.findUnique({ where: { userId } })

    const candidateName = profile?.fullName || formData.fullName || user?.email?.split('@')[0] || 'Candidate'
    const candidateEmail = user?.email || formData.email

    // 5. Create bell notification for all admins
    const admins = await prisma.roles.findMany({
      where: { role: { in: ['admin', 'super_admin'] } },
    })

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.user_id,
          type: 'application_received',
          title: 'New application received',
          message: `${candidateName} applied for ${job.title}.`,
          link: '/dashboard/applications',
        },
      })
    }

    // 6. Notify the client who owns the job (if it's a client job)
    if (job.recruiterId) {
      const recruiterRole = await prisma.roles.findUnique({
        where: { user_id: job.recruiterId },
      })

      if (recruiterRole && recruiterRole.role === 'recruiter') {
        await prisma.notification.create({
          data: {
            userId: job.recruiterId,
            type: 'application_received',
            title: 'New applicant for your job',
            message: `${candidateName} applied for ${job.title}.`,
            link: '/dashboard/applications',
          },
        })
      }
    }

    // 7. Send email to admin team
    await sendEmail({
      to: 'hr@remotehirring.com',
      subject: `New Application — ${job.title}`,
      title: 'New Application Received',
      greeting: 'Hi team,',
      body: `A new candidate has applied for <strong>${job.title}</strong> at ${job.company}.`,
      infoRows: [
        { label: 'Candidate', value: candidateName, highlight: true },
        { label: 'Email', value: candidateEmail || 'N/A' },
        { label: 'Role', value: job.title },
        { label: 'Company', value: job.company },
      ],
      buttonText: 'View Application',
      buttonUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://hiring-remote.vercel.app'}/dashboard/applications`,
    })

    // 8. Send confirmation email to candidate
    if (candidateEmail) {
      await sendEmail({
        to: candidateEmail,
        subject: `Application received — ${job.title}`,
        title: 'Application Received',
        greeting: `Dear ${candidateName},`,
        body: `Thank you for applying for the <strong>${job.title}</strong> position at ${job.company}. We have received your application and our team will review it shortly.`,
        infoRows: [
          { label: 'Role', value: job.title },
          { label: 'Company', value: job.company },
          { label: 'Applied On', value: new Date().toLocaleDateString(), highlight: true },
        ],
        footer: `We'll be in touch if your profile matches what we're looking for. In the meantime, feel free to explore other opportunities on our platform.`,
        buttonText: 'Browse More Jobs',
        buttonUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://hiring-remote.vercel.app'}/jobs`,
      })
    }

    return NextResponse.json({ success: true, applicationId: application.id })
  } catch (error: any) {
    console.error('Application error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}