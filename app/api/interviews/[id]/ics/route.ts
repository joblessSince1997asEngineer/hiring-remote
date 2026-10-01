import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function icsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeIcs(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { job: true },
  })

  if (!interview) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (interview.candidateId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (!interview.scheduledDate) {
    return NextResponse.json({ error: 'Not scheduled' }, { status: 400 })
  }

  const start = new Date(interview.scheduledDate)
  const end = new Date(start.getTime() + 60 * 60 * 1000) // 1 hour default

  const summary = `Interview: ${interview.job?.title || 'Interview'}${interview.job?.company ? ` @ ${interview.job.company}` : ''}`
  const description = [
    interview.candidateNotes ? `Notes: ${interview.candidateNotes}` : '',
    interview.videoLink ? `Video call: ${interview.videoLink}` : '',
    interview.codeEditorLink ? `Code editor: ${interview.codeEditorLink}` : '',
  ].filter(Boolean).join('\n\n')

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Remote Hirring//Interview//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:interview-${interview.id}@remotehirring.com`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    interview.videoLink ? `LOCATION:${escapeIcs(interview.videoLink)}` : '',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Interview reminder',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Interview starting soon',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n')

  return new NextResponse(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="interview-${interview.id.slice(-6)}.ics"`,
    },
  })
}