import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email-send'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { applicationId, jobId, candidateId, requestedBy } = await request.json()

  try {
    const interview = await prisma.interview.create({
      data: { applicationId, jobId, candidateId, status: 'pending', requestedBy: requestedBy || 'admin' },
    })
    return NextResponse.json({ success: true, interview })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  // Rate limit: 10 scheduling requests / hour per IP
  const ip = getClientIp(request)
  const rl = rateLimit(`interviews-schedule:${ip}`, 10, 60 * 60 * 1000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${Math.ceil(rl.retryAfterSeconds / 60)} min.` },
      { status: 429 }
    )
  }

  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const roleRecord = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRecord) return NextResponse.json({ error: 'No role' }, { status: 403 })

  const canSchedule = roleRecord.role === 'admin' || (roleRecord.role === 'recruiter' && roleRecord.allowRecruiterSchedule)
  if (!canSchedule) {
    return NextResponse.json({ error: 'You do not have permission to schedule interviews' }, { status: 403 })
  }

  const { interviewId, scheduledDate, timeZone, videoLink, clientNotes, candidateNotes, interviewers } = await request.json()

  try {
    const interview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        scheduledDate: new Date(scheduledDate),
        timeZone,
        videoLink,
        clientNotes,
        candidateNotes,
        interviewers: interviewers || [],
        status: 'scheduled',
      },
    })

    const job = await prisma.job.findUnique({ where: { id: interview.jobId } })
    const jobTitle = job?.title || 'the role'
    const formattedDate = new Date(scheduledDate).toLocaleString()

    // 1. Email each interviewer in the panel
    for (const memberId of interviewers || []) {
      const member = await prisma.user.findUnique({ where: { id: memberId } })
      if (member?.email) {
        const memberProfile = await prisma.candidateProfile.findUnique({ where: { userId: memberId } })
        const memberName = memberProfile?.fullName || 'there'

        const panelRows = [
          { label: 'Role', value: jobTitle },
          { label: 'Date & Time', value: formattedDate, highlight: true },
          { label: 'Time Zone', value: timeZone },
        ]
        if (clientNotes) panelRows.push({ label: 'Panel Notes', value: clientNotes })

        await sendEmail({
          to: member.email,
          subject: `Interview Panel Invite — ${jobTitle}`,
          title: 'Interview Panel Invite',
          greeting: `Hi ${memberName},`,
          body: `You've been added to the interview panel for this role. Please review the details below.`,
          infoRows: panelRows,
          buttonText: 'Join Video Call',
          buttonUrl: videoLink,
        })
      }
    }

    // 2. Email the candidate + bell notification
    const candidate = await prisma.user.findUnique({ where: { id: interview.candidateId } })
    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: interview.candidateId },
    })
    const candidateName = candidateProfile?.fullName || 'there'

    if (candidate?.email) {
      const candidateRows = [
        { label: 'Role', value: jobTitle },
        { label: 'Date & Time', value: formattedDate, highlight: true },
        { label: 'Time Zone', value: timeZone },
      ]
      if (candidateNotes) candidateRows.push({ label: 'Preparation Notes', value: candidateNotes })

      await sendEmail({
        to: candidate.email,
        subject: `Your interview for ${jobTitle} is scheduled`,
        title: 'Interview Scheduled',
        greeting: `Hi ${candidateName},`,
        body: `Your interview has been confirmed. Please review the details below and join at the scheduled time.`,
        infoRows: candidateRows,
        buttonText: 'Join Video Call',
        buttonUrl: videoLink,
      })

      // Bell notification for candidate
      await prisma.notification.create({
        data: {
          userId: candidate.id,
          type: 'interview_scheduled',
          title: 'Interview scheduled',
          message: `Your interview for ${jobTitle} is scheduled for ${formattedDate}.`,
          link: '/account',
        },
      })
    }

    // 3. Bell notification for the client who requested
    if (interview.requestedByUserId) {
      await prisma.notification.create({
        data: {
          userId: interview.requestedByUserId,
          type: 'interview_scheduled',
          title: 'Interview scheduled',
          message: `Interview for ${jobTitle} scheduled for ${formattedDate}.`,
          link: '/dashboard/interviews',
        },
      })
    }

    return NextResponse.json({ success: true, interview })
  } catch (error: any) {
    console.error('Interview schedule error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}