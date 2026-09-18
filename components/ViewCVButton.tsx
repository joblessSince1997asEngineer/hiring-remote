'use client'

import { toast } from 'sonner'
import { useState } from 'react'

export default function ViewCVButton({ url }: { url: string }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/get-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (res.ok && data.url) {
        window.open(data.url, '_blank')
      } else {
        toast.error(data.error || 'Could not open CV')
      }
    } catch (err) {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-blue-600 font-medium hover:underline disabled:opacity-50"
    >
      {loading ? 'Opening...' : 'View CV'}
    </button>
  )
}