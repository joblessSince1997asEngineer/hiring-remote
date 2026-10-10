'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-5xl font-black text-[#facc15] leading-none mb-3">
          Oops
        </p>
        <h1 className="text-xl font-bold text-[#0f172a] mb-2">
          Something went wrong
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          This has been logged — try refreshing.
        </p>

        {error.digest && (
          <p className="text-[11px] text-slate-400 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#0f172a] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-800 transition"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="border border-slate-300 text-slate-700 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-50 transition no-underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}