'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import VideoRecorder from './VideoRecorder'

type Question = {
  id: string
  question: string
  timeLimit: number
}

type ResponseItem = {
  questionId: string
  path: string
  duration: number
  tabSwitches: number
}

export default function ScreeningFlow({
  applicationId,
  questions,
}: {
  applicationId: string
  questions: Question[]
}) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<ResponseItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  const total = questions.length
  const q = questions[currentIndex]

  async function handleGetUploadUrl(fileExt: string) {
    const res = await fetch('/api/screening/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId,
        questionId: q.id,
        fileExt,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to get upload URL')
    return { uploadUrl: data.uploadUrl, path: data.path }
  }

  function handleQuestionComplete(data: { path: string; duration: number; tabSwitches: number }) {
  // VideoRecorder doesn't know the questionId — attach it here before saving
  const enriched: ResponseItem = {
    questionId: q.id,
    path: data.path,
    duration: data.duration,
    tabSwitches: data.tabSwitches,
  }
  const next = [...responses, enriched]
  setResponses(next)

  if (currentIndex + 1 < total) {
    setCurrentIndex(currentIndex + 1)
  } else {
    submitAll(next)
  }
}

  async function submitAll(all: ResponseItem[]) {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/screening/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          responses: all,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setDone(true)
    } catch (e: any) {
      setError(e?.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  // ============ INTRO SCREEN ============
  if (showIntro) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-bold text-[#0f172a] mb-1">Before you begin</h2>
            <p className="text-sm text-slate-600">
              This is a short video screening. You&apos;ll answer {total}{' '}
              question{total === 1 ? '' : 's'} on camera.
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-sm text-slate-700 mb-6">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Each question has its own time limit — the recording auto-stops when time is up.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>You get one retake per question before submitting.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Do not switch tabs or leave the window</strong> while recording.
              You get 3 warnings, then the attempt is stopped.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Your videos are only visible to the hiring team — not shared with other employers.</span>
          </li>
        </ul>

        <button
          onClick={() => setShowIntro(false)}
          className="w-full bg-[#0f172a] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-slate-800 transition"
        >
          I understand — Start
        </button>
      </div>
    )
  }

  // ============ DONE ============
  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-[#0f172a] mb-2">
          Screening submitted
        </h2>
        <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
          Thank you. Our team will review your responses and get back to you
          about next steps within a few days.
        </p>
        <button
          onClick={() => router.push('/account')}
          className="bg-[#0f172a] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-slate-800 transition"
        >
          Back to My Account
        </button>
      </div>
    )
  }

  // ============ SUBMITTING ============
  if (submitting) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-600">Submitting your responses…</p>
      </div>
    )
  }

  // ============ RECORDING LOOP ============
  return (
    <div>
      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>
            Question {currentIndex + 1} of {total}
          </span>
          <span>
            {responses.length} completed
          </span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{
              width: `${(responses.length / total) * 100}%`,
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <VideoRecorder
        key={q.id}
        questionText={q.question}
        questionNumber={currentIndex + 1}
        totalQuestions={total}
        timeLimit={q.timeLimit}
        onGetUploadUrl={handleGetUploadUrl}
        onComplete={handleQuestionComplete}
      />
    </div>
  )
}