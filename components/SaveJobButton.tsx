'use client'

import { Bookmark } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function SaveJobButton({
  jobId,
  initiallySaved = false,
}: {
  jobId: string
  initiallySaved?: boolean
}) {
  const [saved, setSaved] = useState(initiallySaved)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Check if this job is saved on mount (for logged-in users)
  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/saved-jobs')
        if (!res.ok) return // not logged in
        const data = await res.json()
        setSaved((data.jobIds || []).includes(jobId))
      } catch {
        // silent
      }
    }
    if (!initiallySaved) check()
  }, [jobId, initiallySaved])

  const handleToggle = async (e: React.MouseEvent) => {
    // Prevent navigation if button is inside a Link
    e.preventDefault()
    e.stopPropagation()

    setLoading(true)
    try {
      const res = await fetch('/api/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      })

      if (res.status === 401) {
        toast.error('Log in to save jobs')
        router.push('/login')
        return
      }

      const data = await res.json()
      if (res.ok) {
        setSaved(data.saved)
        toast.success(data.saved ? 'Job saved' : 'Job removed')
      } else {
        toast.error(data.error || 'Something went wrong')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={saved ? 'Remove from saved' : 'Save job'}
      className="bg-transparent border-none cursor-pointer p-1 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
    >
      <Bookmark
                className={`w-5 h-5 transition-colors ${
          saved ? 'text-[#0f172a] fill-[#0f172a]' : 'text-slate-500'
        }`}
      />
    </button>
  )
}