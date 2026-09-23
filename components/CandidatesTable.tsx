'use client'

import { toast } from 'sonner'
import ViewCVButton from '@/components/ViewCVButton'
import { useState, useEffect } from 'react'
import { Search, FileText, CheckCircle2, AlertCircle, User } from 'lucide-react'

export default function CandidatesTable({ initialJobs }: { initialJobs: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [maxSalary, setMaxSalary] = useState('')
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState<string | null>(null)
  const [showIncomplete, setShowIncomplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams()
        if (searchTerm) query.set('q', searchTerm)
        if (maxSalary) query.set('salary', maxSalary)

        const res = await fetch(`/api/search?${query.toString()}`)
        const data = await res.json()
        if (data.candidates) setCandidates(data.candidates)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, maxSalary])

  const handleAssign = async (candidateId: string, jobId: string) => {
    if (!jobId) return toast.error('Please select a job first')
    setAssigning(candidateId)
    try {
      const res = await fetch('/api/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, jobId }),
      })
      const data = await res.json()
      if (res.ok) toast.success('Successfully Assigned!')
      else toast.error(data.error || 'Error assigning candidate')
    } catch (e) {
      toast.error('Network error')
    } finally {
      setAssigning(null)
    }
  }

  const getMaskedId = (id: string) => id.slice(-4)

  // Completeness: 0 = empty, 1 = partial, 2 = complete
  const getCompleteness = (c: any) => {
    const hasSkill = c.primary_skill && c.primary_skill !== 'Not Set'
    const hasExp = !!c.years_exp
    const hasCV = !!c.cv_url
    const score = [hasSkill, hasExp, hasCV].filter(Boolean).length
    return score
  }

  // Filter based on toggle
  const visibleCandidates = showIncomplete
    ? candidates
    : candidates.filter(c => getCompleteness(c) >= 2)

  const emptyCount = candidates.length - visibleCandidates.length

  return (
    <div>
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by skill, name, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm"
            />
          </div>
          <input
            type="number"
            placeholder="Max Salary ($)"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm"
          />
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
            <input
              type="checkbox"
              checked={showIncomplete}
              onChange={(e) => setShowIncomplete(e.target.checked)}
              className="w-4 h-4"
            />
            Show incomplete profiles
            {emptyCount > 0 && !showIncomplete && (
              <span className="text-xs text-slate-400">({emptyCount} hidden)</span>
            )}
          </label>
          <span className="text-xs text-slate-400">
            {visibleCandidates.length} candidate{visibleCandidates.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Candidate</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Primary Skill</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Exp</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Salary Exp.</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">CV</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Assign</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">Searching...</td>
                </tr>
              ) : visibleCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">
                    {candidates.length === 0
                      ? 'No candidates found.'
                      : 'All candidates are incomplete. Toggle "Show incomplete profiles" to view.'}
                  </td>
                </tr>
              ) : (
                visibleCandidates.map((candidate) => {
                  const score = getCompleteness(candidate)
                  return (
                    <tr key={candidate.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        {score === 3 ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : score === 2 ? (
                          <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-slate-300" />
                        )}
                      </td>
                                            <td className="p-4 font-medium text-[#0f172a] text-sm">
                        {candidate.full_name || 'Unknown Candidate'}
                      </td>
                      <td className="p-4 text-slate-600 text-sm">
                        {candidate.primary_skill && candidate.primary_skill !== 'Not Set'
                          ? candidate.primary_skill
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="p-4 text-slate-600 text-sm">
                        {candidate.years_exp
                          ? `${candidate.years_exp} yrs`
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="p-4 text-slate-600 text-sm">
                        {candidate.expected_salary
                          ? `$${candidate.expected_salary.toLocaleString()}`
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="p-4 text-sm">
                        {candidate.cv_url ? (
                          <ViewCVButton url={candidate.cv_url} />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <select
                            id={`job-${candidate.id}`}
                            className="p-2 border border-slate-300 rounded text-sm min-w-[140px]"
                            defaultValue=""
                          >
                            <option value="">Select Job...</option>
                            {initialJobs.map((job) => (
                              <option key={job.id} value={job.id}>{job.title}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              const sel = document.getElementById(`job-${candidate.id}`) as HTMLSelectElement
                              handleAssign(candidate.id, sel?.value || '')
                            }}
                            disabled={assigning === candidate.id}
                            className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800 disabled:opacity-50 whitespace-nowrap"
                          >
                            {assigning === candidate.id ? '...' : 'Assign'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}