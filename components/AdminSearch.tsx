'use client'
import { useState, useEffect } from 'react'

export default function AdminSearch({ initialJobs }: { initialJobs: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [maxSalary, setMaxSalary] = useState('')
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState<string | null>(null)

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
    if (!jobId) return alert('Please select a job first')
    setAssigning(candidateId)
    try {
      const res = await fetch('/api/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, jobId }),
      })
      const data = await res.json()
      if (res.ok) alert('Successfully Assigned!')
      else alert(data.error || 'Error assigning candidate')
    } catch (e) {
      alert('Network error')
    } finally {
      setAssigning(null)
    }
  }

  const getMaskedId = (id: string) => id.slice(-4)

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by skill or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400"
        />
        <input
          type="number"
          placeholder="Max Salary ($)"
          value={maxSalary}
          onChange={(e) => setMaxSalary(e.target.value)}
          className="p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400"
        />
      </div>

      {loading && <p className="text-slate-500 mb-4">Searching...</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 px-4 font-semibold text-slate-700">Candidate</th>
              <th className="py-3 px-4 font-semibold text-slate-700">Primary Skill</th>
              <th className="py-3 px-4 font-semibold text-slate-700">Exp</th>
              <th className="py-3 px-4 font-semibold text-slate-700">Salary</th>
              <th className="py-3 px-4 font-semibold text-slate-700">CV</th>
              <th className="py-3 px-4 font-semibold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-800">Candidate #{getMaskedId(candidate.id)}</td>
                <td className="py-3 px-4 text-slate-600">{candidate.primary_skill}</td>
                <td className="py-3 px-4 text-slate-600">{candidate.years_exp}</td>
                <td className="py-3 px-4 text-slate-600">{candidate.expected_salary ? `$${candidate.expected_salary}` : '-'}</td>
                
                {/* THE VIEW CV CELL */}
                <td className="py-3 px-4">
                  {candidate.cv_url ? (
                    <a
                      href={candidate.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      View CV
                    </a>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>

                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <select id={`job-${candidate.id}`} className="p-2 border rounded text-sm">
                      <option value="">Select Job...</option>
                      {initialJobs.map((job) => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAssign(candidate.id, (document.getElementById(`job-${candidate.id}`) as HTMLSelectElement)?.value || '')}
                      disabled={assigning === candidate.id}
                      className="bg-black text-white px-3 py-2 rounded text-sm font-medium hover:bg-slate-800"
                    >
                      {assigning === candidate.id ? '...' : 'Assign'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}