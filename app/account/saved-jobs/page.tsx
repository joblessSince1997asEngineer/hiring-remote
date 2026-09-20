'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bookmark, MapPin, Briefcase, DollarSign, ArrowLeft, Loader2 } from 'lucide-react'

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/saved-jobs')
        if (res.status === 401) {
          router.push('/login')
          return
        }
        const data = await res.json()
        setJobs(data.jobs || [])
      } catch (err) {
        console.error('Load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const handleRemove = async (jobId: string) => {
    // Optimistic remove
    setJobs(prev => prev.filter(j => j.id !== jobId))
    await fetch('/api/saved-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 md:py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <Link
          href="/account"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6 no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-1">Saved Jobs</h1>
          <p className="text-slate-500 text-sm">
            {jobs.length === 0
              ? 'Jobs you bookmark will appear here.'
              : `${jobs.length} saved job${jobs.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-6">No saved jobs yet.</p>
            <Link
              href="/jobs"
              className="inline-block bg-[#0f172a] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-slate-800 transition-colors no-underline"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const symbol = job.currency === 'EUR' ? '€' : job.currency === 'GBP' ? '£' : job.currency === 'PKR' ? '₨' : job.currency === 'INR' ? '₹' : '$'
              const period = job.salaryPeriod === 'month' ? '/mo' : '/yr'

              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#facc15] hover:shadow-md transition-all no-underline"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-[#0f172a] mb-1 truncate">
                        {job.title}
                      </h2>
                      <p className="text-slate-500 text-sm mb-3 truncate">
                        {job.company} • {job.location}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {job.remoteType && (
                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs capitalize">
                            🌐 {job.remoteType}
                          </span>
                        )}
                        {job.type && (
                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">
                            💼 {job.type}
                          </span>
                        )}
                        {job.salaryMin && job.salaryMax && (
                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">
                            💰 {symbol}{job.salaryMin.toLocaleString()}–{symbol}{job.salaryMax.toLocaleString()}{period}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRemove(job.id)
                      }}
                      className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors self-start shrink-0"
                    >
                      <Bookmark className="w-4 h-4 fill-[#0f172a] text-[#0f172a]" />
                      Saved
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}