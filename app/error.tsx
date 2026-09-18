'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center">
        <p className="text-6xl md:text-8xl font-black text-[#facc15] leading-none mb-4">
          Oops
        </p>

        <h1 className="text-2xl md:text-4xl font-bold mb-3">
          Something went wrong
        </h1>

        <p className="text-slate-300 mb-8 leading-relaxed">
          An unexpected error occurred. This has been logged and we're on it.
        </p>

        {error.digest && (
          <p className="text-xs text-slate-500 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#facc15] text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-slate-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/5 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}