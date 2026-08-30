'use client'
import { useState } from 'react'

export default function ClientDashboard({ jobs }: { jobs: any[] }) {
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')

  const handleAction = async (jobId: string, action: 'interview' | 'reject' | 'hire', reason?: string) => {
    const res = await fetch('/api/client-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, action, feedback: reason }),
    })

    if (res.ok) {
      if (action === 'interview') alert('Interview Requested!')
      else if (action === 'reject') alert('Candidate Rejected')
      else if (action === 'hire') {
        alert('Candidate Hired! Redirecting to Invoice...')
        window.location.href = `/invoice?jobId=${jobId}`; 
        return;
      }
      
      window.location.reload()
    } else {
      const data = await res.json()
      alert(data.error || 'Error performing action')
    }
  }

  return (
    <div className="space-y-8">
      {jobs.length === 0 ? (
        <div className="bg-white p-8 rounded-xl text-center text-slate-500">No jobs posted yet.</div>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                <p className="text-slate-500">{job.company}</p>
              </div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {job.assignments.length} Candidates
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {job.assignments.length === 0 ? (
                <p className="text-slate-400">No candidates assigned yet.</p>
              ) : (
                job.assignments.map((assignment: any) => (
                  <div key={assignment.id} className="border border-slate-200 rounded-xl p-4">
                    <h3 className="font-bold text-slate-800 mb-2">Candidate #{assignment.candidate.id.slice(-4)}</h3>
                    <div className="text-sm text-slate-600 space-y-1 mb-4">
                      <p>Skill: {assignment.candidate.primary_skill || '-'}</p>
                      <p>Exp: {assignment.candidate.years_exp || '-'} yrs</p>
                      <p>Salary: {assignment.candidate.expected_salary ? `$${assignment.candidate.expected_salary}` : '-'}</p>
                      
                      {/* FIXED: Look at the Application table's CV URL */}
                      <div className="mt-2">
                        {job.applications[0]?.cv_url ? (
                          <a href={job.applications[0].cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                            View CV
                          </a>
                        ) : (
                          <span className="text-slate-400">No CV</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(job.id, 'interview')} className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800">Request Interview</button>
                      <button onClick={() => setRejecting(assignment.id)} className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-50">Reject</button>
                      <button onClick={() => handleAction(job.id, 'hire')} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700">Confirm Hire</button>
                    </div>

                    {rejecting === assignment.id && (
                      <div className="mt-4 p-4 border border-red-200 rounded-lg bg-red-50">
                        <textarea placeholder="Rejection reason (min 10 chars)" value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full p-2 border border-red-300 rounded mb-2 text-sm" minLength={10} />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setRejecting(null)} className="text-xs text-slate-500">Cancel</button>
                          <button onClick={() => { if (feedback.length >= 10) { handleAction(job.id, 'reject', feedback) } else { alert('Please enter a minimum of 10 characters') } }} className="text-xs bg-red-500 text-white px-3 py-1 rounded">Confirm Reject</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}