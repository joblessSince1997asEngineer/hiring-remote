import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const cookieStore = await cookies()
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
  const cookieStore = await cookies()
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const roleRecord = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRecord) return NextResponse.json({ error: 'No role' }, { status: 403 })

  // *** PERMISSION CHECK ***
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

    // Send email to each selected interviewer
    for (const memberId of interviewers) {
      const member = await prisma.user.findUnique({ where: { id: memberId } })
      if (member?.email) {
        try {
          await resend.emails.send({
            from: 'Remote Hirring <onboarding@resend.dev>',
            to: [member.email],
            subject: `You're invited to an interview for ${job?.title}`,
            html: `<p>You are invited to an interview.</p>
                   <p><strong>Date:</strong> ${new Date(scheduledDate).toLocaleString()}</p>
                   <p><strong>Time Zone:</strong> ${timeZone}</p>
                   <p><strong>Video Link:</strong> <a href="${videoLink}">${videoLink}</a></p>
                   <p><strong>Notes:</strong> ${clientNotes || 'None'}</p>`,
          })
        } catch (emailError) {
          console.error(`Email failed for ${member.email}:`, emailError)
        }
      }
    }

    // Send email to the candidate
    try {
      await resend.emails.send({
        from: 'Remote Hirring <onboarding@resend.dev>',
        to: ['candidate@example.com'],
        subject: `Your Interview for ${job?.title}`,
        html: `<p>Your interview has been scheduled!</p>
               <p><strong>Date:</strong> ${new Date(scheduledDate).toLocaleString()}</p>
               <p><strong>Time Zone:</strong> ${timeZone}</p>
               <p><strong>Video Link:</strong> <a href="${videoLink}">${videoLink}</a></p>
               <p><strong>Notes:</strong> ${candidateNotes || 'None'}</p>`,
      })
    } catch (emailError) {
      console.error('Candidate email failed:', emailError)
    }

    return NextResponse.json({ success: true, interview })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}