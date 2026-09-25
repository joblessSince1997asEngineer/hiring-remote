'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search, Loader2, User as UserIcon, Briefcase, FileText,
  ArrowLeft, MapPin,
} from 'lucide-react'

type Candidate = {
  id: string
  fullName: string
  primarySkill: string | null
  yearsExp: number | null
  expectedSalary: number | null
}

type JobResult = {
  id: string
  title: string
  company: string
  location: string
  type: string
  status: string
}

type AppResult = {
  id: string
  candidateName: string
  jobTitle: string
  status: string
  appliedAt: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobs, setJobs] = useState<JobResult[]>([])
  const [applications, setApplications] = useState<AppResult[]>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState(query)

  useEffect(() => {
    setInputValue(query)
    if (!query.trim()) {
      setCandidates([])
      setJobs([])
      setApplications([])
      return
    }

    let cancelled = false
    setLoading(true)

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        setCandidates(data.candidates || [])
        setJobs(data.jobs || [])
        setApplications(data.applications || [])
      })
      .catch(() => {
        if (!cancelled) {
          setCandidates([])
          setJobs([])
          setApplications([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = inputValue.trim()
    if (q) window.location.href = `/dashboard/search?q=${encodeURIComponent(q)}`
  }

  const totalResults = candidates.length + jobs.length + applications.length

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6 no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-[#0f172a] mb-1">Search</h1>
      <p className="text-sm text-slate-500 mb-6">
        Search across jobs, candidates, and applications.
      </p>

      <form onSubmit={handleSubmit} className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by job title, candidate name, skill..."
          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#facc15]"
        />
      </form>

      {loading && (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Searching...
        </div>
      )}

      {!loading && !query && (
        <p className="text-slate-500 text-sm">Type something to search.</p>
      )}

      {!loading && query && totalResults === 0 && (
        <p className="text-slate-500 text-sm">
          No results found for <strong className="text-slate-700">{query}</strong>
        </p>
      )}

      {/* JOBS */}
      {!loading && jobs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
            Jobs ({jobs.length})
          </h2>
          <div className="space-y-2">
            {jobs.map(j => (
              <Link
                key={j.id}
                href={`/jobs/${j.id}`}
                className="block p-4 bg-white border border-slate-200 rounded-xl hover:border-[#facc15] transition-colors no-underline"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fffbeb] flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-[#facc15]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#0f172a] truncate">{j.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {j.company}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {j.location}
                      </span>
                      <span>💼 {j.type}</span>
                      <span className="capitalize">● {j.status}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CANDIDATES */}
      {!loading && candidates.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
            Candidates ({candidates.length})
          </h2>
          <div className="space-y-2">
            {candidates.map(c => (
              <div key={c.id} className="p-4 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fffbeb] flex items-center justify-center shrink-0">
                    <UserIcon className="w-5 h-5 text-[#facc15]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#0f172a] truncate">{c.fullName}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                      {c.primarySkill && <span>🛠 {c.primarySkill}</span>}
                      {c.yearsExp != null && <span>📅 {c.yearsExp} yrs exp</span>}
                      {c.expectedSalary != null && (
                        <span>💰 ${c.expectedSalary.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* APPLICATIONS */}
      {!loading && applications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
            Applications ({applications.length})
          </h2>
          <div className="space-y-2">
            {applications.map(a => (
              <Link
                key={a.id}
                href="/dashboard/applications"
                className="block p-4 bg-white border border-slate-200 rounded-xl hover:border-[#facc15] transition-colors no-underline"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fffbeb] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#facc15]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#0f172a] truncate">
                      {a.candidateName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      Applied to: {a.jobTitle}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 capitalize">
                      Status: {a.status} • {new Date(a.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="p-8 flex items-center gap-2 text-slate-500 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading search...
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}