'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Video, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'

export default function InviteToScreeningButton({
  applicationId,
  screeningStatus,
}: {
  applicationId: string
  screeningStatus: string | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Already invited — waiting for candidate
  if (screeningStatus === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap">
        <Clock className="w-4 h-4" /> Screening Invited
      </span>
    )
  }

  // Candidate submitted — admin needs to review
  if (screeningStatus === 'submitted') {
    return (
      <a
        href="/dashboard/screenings"
        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold no-underline whitespace-nowrap transition-colors"
      >
        <Video className="w-4 h-4" /> Review Screening →
      </a>
    )
  }

  // Passed
  if (screeningStatus === 'approved') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap">
        <CheckCircle2 className="w-4 h-4" /> Screening Passed
      </span>
    )
  }

  // Rejected
  if (screeningStatus === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap">
        <XCircle className="w-4 h-4" /> Screening Rejected
      </span>
    )
  }

  // screeningStatus === null → Invite button
  async function handleInvite() {
    if (
      !confirm(
        'Send this candidate a video screening invite?\n\nThey will see a "Start Screening" button on their dashboard.'
      )
    )
      return

    setLoading(true)
    try {
      const res = await fetch('/api/screening/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      toast.success('Screening invite sent')
      router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleInvite}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-50 whitespace-nowrap transition-colors"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Video className="w-4 h-4" />
      )}
      Invite to Screening
    </button>
  )
}