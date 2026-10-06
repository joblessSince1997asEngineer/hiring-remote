'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Video, Loader2, CheckCircle2, XCircle, AlertTriangle,
  ChevronLeft, ChevronRight, Clock,
} from 'lucide-react'
import { toast } from 'sonner'

type Response = {
  id: string
  question: string
  order: number
  duration: number
  tabSwitches: number
  submittedAt: string
}

type Props = {
  application: {
    id: string
    screeningStatus: string | null
    screeningNotes: string | null
    screeningSubmittedAt: string | null
    screeningReviewedAt: string | null
    jobTitle: string
    jobCompany: string
    candidateEmail: string
    responses: Response[]
  }
}

export default function ScreeningReview({ application }: Props) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [loadingUrl, setLoadingUrl] = useState(false)
  const [notes, setNotes] = useState(application.screeningNotes || '')
  const [submitting, setSubmitting] = useState(false)

  const current = application.responses[currentIndex]
  const total = application.responses.length
  const totalTabSwitches = application.responses.reduce((s, r) => s + r.tabSwitches, 0)
  const isReviewed = application.screeningStatus === 'approved' || application.screeningStatus === 'rejected'

  // Load signed video URL when current changes
  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!current) return
      setLoadingUrl(true)
      setVideoUrl('')
      try {
        const res = await fetch('/api/screening/get-video-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ responseId: current.id }),
        })
        const data = await res.json()
        if (!cancelled && res.ok) setVideoUrl(data.url)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoadingUrl(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [current])

  async function handleDecision(decision: 'approved' | 'rejected') {
    if (isReviewed) return
    const confirmMsg = decision === 'approved'
      ? 'Approve this candidate to move forward to the interview stage?'
      : 'Reject this candidate? They will be notified.'
    if (!confirm(confirmMsg)) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/screening/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: application.id,
          decision,
          notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      toast.success(decision === 'approved' ? 'Approved' : 'Rejected')
      router.push('/dashboard/screenings')
      router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  function fmt(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = Math.floor(sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-[#0f172a] mb-1">
              {application.jobTitle}
            </h1>
            <p className="text-slate-500 text-sm">{application.jobCompany}</p>
            <p className="text-xs text-slate-400 mt-1">{application.candidateEmail}</p>
          </div>

          {application.screeningStatus && (
            <span className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold uppercase border ${
              application.screeningStatus === 'approved'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : application.screeningStatus === 'rejected'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {application.screeningStatus}
            </span>
          )}
        </div>

        {/* Integrity summary */}
        {totalTabSwitches > 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>{totalTabSwitches} tab switch{totalTabSwitches === 1 ? '' : 'es'}</strong>{' '}
              detected across all responses. Review carefully.
            </div>
          </div>
        )}
      </div>

      {/* Question navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        <div className="text-sm text-slate-500">
          Question <strong className="text-slate-800">{currentIndex + 1}</strong> of {total}
        </div>

        <button
          onClick={() => setCurrentIndex(i => Math.min(total - 1, i + 1))}
          disabled={currentIndex === total - 1}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Question + video */}
      {current && (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Question</p>
            <p className="text-base text-[#0f172a] leading-relaxed whitespace-pre-wrap">
              {current.question}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {fmt(current.duration)}
              </span>
              {current.tabSwitches > 0 && (
                <span className="inline-flex items-center gap-1 text-amber-600">
                  <AlertTriangle className="w-3.5 h-3.5" /> {current.tabSwitches} tab switch{current.tabSwitches === 1 ? '' : 'es'}
                </span>
              )}
            </div>
          </div>

          <div className="bg-black rounded-2xl overflow-hidden aspect-video relative">
            {loadingUrl && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}
            {!loadingUrl && videoUrl && (
              <video
                key={videoUrl}
                src={videoUrl}
                controls
                controlsList="nodownload"
                className="w-full h-full object-contain"
              />
            )}
            {!loadingUrl && !videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
                <Video className="w-6 h-6 mr-2" /> Video unavailable
              </div>
            )}
          </div>
        </>
      )}

      {/* Decision block */}
      {!isReviewed ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
              Reviewer notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Strong communication, solid technical depth…"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#facc15] resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleDecision('rejected')}
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-red-200 text-red-700 px-5 py-3 rounded-full font-semibold text-sm hover:bg-red-50 transition disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Reject
            </button>
            <button
              onClick={() => handleDecision('approved')}
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-full font-semibold text-sm hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Approve
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-600">
            Already <strong>{application.screeningStatus}</strong>
            {application.screeningReviewedAt && (
              <> on {new Date(application.screeningReviewedAt).toLocaleString()}</>
            )}
          </p>
          {application.screeningNotes && (
            <p className="text-xs text-slate-500 mt-2 italic">Notes: {application.screeningNotes}</p>
          )}
        </div>
      )}
    </div>
  )
}