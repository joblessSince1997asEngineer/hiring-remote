export const dynamic = 'force-dynamic'
import { getUserId } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Calendar, Clock, Video, Code, Users, ArrowLeft,
  ExternalLink, CheckCircle2, AlertCircle, Download, Globe
} from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  pending:              'bg-yellow-100 text-yellow-700',
  scheduled:            'bg-blue-100 text-blue-700',
  completion_requested: 'bg-purple-100 text-purple-700',
  completed:            'bg-green-100 text-green-700',
  cancelled:            'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  pending:              'Pending Scheduling',
  scheduled:            'Scheduled',
  completion_requested: 'Awaiting Confirmation',
  completed:            'Completed',
  cancelled:            'Cancelled',
}

export default async function InterviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const { id } = await params

  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { job: true },
  })

  if (!interview) notFound()
  if (interview.candidateId !== userId) redirect('/account')

  // Panel member emails
  const panelIds: string[] = Array.isArray(interview.interviewers)
    ? (interview.interviewers as string[])
    : []
  const panelUsers = panelIds.length
    ? await prisma.user.findMany({
        where: { id: { in: panelIds } },
        select: { id: true, email: true },
      })
    : []

  const scheduled = interview.scheduledDate ? new Date(interview.scheduledDate) : null
  const now = new Date()
  const isUpcoming = scheduled && scheduled > now && interview.status === 'scheduled'
  const hoursUntil = scheduled
    ? Math.round((scheduled.getTime() - now.getTime()) / 3600000)
    : null

  const statusStyle = STATUS_STYLES[interview.status] ?? 'bg-slate-100 text-slate-700'
  const statusLabel = STATUS_LABELS[interview.status] ?? interview.status

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 md:py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back link */}
        <Link
          href="/account"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 no-underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Account
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-1">
                {interview.job?.title || 'Interview'}
              </h1>
              <p className="text-slate-500">{interview.job?.company || ''}</p>
            </div>
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap self-start ${statusStyle}`}>
              {statusLabel}
            </span>
          </div>

          {/* Countdown / status banner */}
          {isUpcoming && hoursUntil !== null && (
            <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  {hoursUntil < 1
                    ? 'Starting soon — join the call below'
                    : hoursUntil < 24
                      ? `In ${hoursUntil} hour${hoursUntil === 1 ? '' : 's'}`
                      : `In ${Math.floor(hoursUntil / 24)} day${Math.floor(hoursUntil / 24) === 1 ? '' : 's'}`}
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Make sure your camera and microphone are working before joining.
                </p>
              </div>
            </div>
          )}

          {interview.status === 'completed' && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900">Interview completed</p>
                <p className="text-xs text-green-700 mt-0.5">
                  Thank you. We&apos;ll be in touch with next steps.
                </p>
              </div>
            </div>
          )}

          {interview.status === 'cancelled' && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">Interview cancelled</p>
                <p className="text-xs text-red-700 mt-0.5">
                  If you believe this was a mistake, please contact support.
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {interview.status === 'scheduled' && (
            <div className="flex flex-col sm:flex-row gap-3">
              {interview.videoLink && (
                <a
                  href={interview.videoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0f172a] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-slate-800 transition-colors no-underline"
                >
                  <Video className="w-4 h-4" />
                  Join Video Call
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {interview.codeEditorLink && (
                <a
                  href={interview.codeEditorLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-slate-300 text-[#0f172a] px-6 py-3 rounded-full font-semibold text-sm hover:bg-slate-50 transition-colors no-underline"
                >
                  <Code className="w-4 h-4" />
                  Open Code Editor
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {scheduled && (
                <a
                  href={`/api/interviews/${interview.id}/ics`}
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 text-[#0f172a] px-6 py-3 rounded-full font-semibold text-sm hover:bg-slate-50 transition-colors no-underline"
                >
                  <Download className="w-4 h-4" />
                  Add to Calendar
                </a>
              )}
            </div>
          )}
        </div>

        {/* Details card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-5">
          <h2 className="text-lg font-bold text-[#0f172a] pb-3 border-b border-slate-100">
            Interview Details
          </h2>

          {scheduled ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-0.5">Date</p>
                    <p className="text-sm text-slate-800">
                      {scheduled.toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-0.5">Time</p>
                    <p className="text-sm text-slate-800">
                      {scheduled.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-0.5">Time Zone</p>
                    <p className="text-sm text-slate-800">{interview.timeZone || 'UTC'}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500 italic">
              Not scheduled yet. The interviewer will pick a time soon.
            </p>
          )}

          {/* Panel members */}
          {panelUsers.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
                    Interview Panel ({panelUsers.length})
                  </p>
                  <ul className="space-y-1">
                    {panelUsers.map((p) => (
                      <li key={p.id} className="text-sm text-slate-700">
                        {p.email}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes card (only if notes exist) */}
        {(interview.candidateNotes || interview.clientNotes) && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
            <h2 className="text-lg font-bold text-[#0f172a] pb-3 border-b border-slate-100">
              Preparation Notes
            </h2>

            {interview.candidateNotes && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
                  For you
                </p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {interview.candidateNotes}
                </p>
              </div>
            )}

            {interview.clientNotes && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
                  General notes
                </p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {interview.clientNotes}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}