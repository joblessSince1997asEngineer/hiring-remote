'use client'
import { useState } from 'react'
import ViewCVButton from '@/components/ViewCVButton'
import HireRequestModal from '@/components/HireRequestModal'

export default function ClientDashboard({ jobs }: { jobs: any[] }) {
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [interviewPrompt, setInterviewPrompt] = useState<{ jobId: string, candidateId: string } | null>(null)
  const [wantToAttend, setWantToAttend] = useState(true)
  const [hirePrompt, setHirePrompt] = useState<{ jobId: string, candidateId: string, jobTitle: string } | null>(null)

  const handleAction = async (
    jobId: string,
    candidateId: string,
    action: 'interview' | 'reject' | 'hire',
    reason?: string,
    clientRequestedToAttend?: boolean
  ) => {
    const res = await fetch('/api/client-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, candidateId, action, feedback: reason, clientRequestedToAttend }),
    })

    if (res.ok) {
      if (action === 'interview') alert('Interview Requested!')
      else if (action === 'reject') alert('Candidate Rejected')
      else if (action === 'hire') {
        alert('Candidate Hired! Redirecting to Invoice...')
        window.location.href = `/invoice?jobId=${jobId}`
        return
      }
      window.location.reload()
    } else {
      const data = await res.json()
      alert(data.error || 'Error performing action')
    }
  }

  const submitInterviewRequest = () => {
    if (!interviewPrompt) return
    handleAction(interviewPrompt.jobId, interviewPrompt.candidateId, 'interview', undefined, wantToAttend)
    setInterviewPrompt(null)
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
                    <h3 className="font-bold text-slate-800 mb-2">
                      Candidate #{assignment.candidate.id.slice(-4)}
                    </h3>
                    <div className="text-sm text-slate-600 space-y-1 mb-4">
                      <p>Skill: {assignment.candidate.primary_skill !== 'Not Set' ? assignment.candidate.primary_skill : '-'}</p>
                      <p>Exp: {assignment.candidate.years_exp ? `${assignment.candidate.years_exp} yrs` : '-'}</p>
                      <p>Salary: {assignment.candidate.expected_salary ? `$${assignment.candidate.expected_salary}` : '-'}</p>
                      <div className="mt-2">
                        {assignment.candidate.cv_url ? (
                          <ViewCVButton url={assignment.candidate.cv_url} />
                        ) : (
                          <span className="text-slate-400">No CV</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => { setInterviewPrompt({ jobId: job.id, candidateId: assignment.candidate.id }); setWantToAttend(true); }}
                        className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
                      >
                        Request Interview
                      </button>
                      <button
                        onClick={() => setRejecting(assignment.id)}
                        className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-50"
                      >
                        Reject
                      </button>
                      <button
  onClick={() => setHirePrompt({ jobId: job.id, candidateId: assignment.candidate.id, jobTitle: job.title })}
  className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700"
>
  Confirm Hire
</button>
                    </div>

                    {rejecting === assignment.id && (
                      <div className="mt-4 p-4 border border-red-200 rounded-lg bg-red-50">
                        <textarea
                          placeholder="Rejection reason (min 10 chars)"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          className="w-full p-2 border border-red-300 rounded mb-2 text-sm"
                          minLength={10}
                        />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setRejecting(null)} className="text-xs text-slate-500">Cancel</button>
                          <button
                            onClick={() => {
                              if (feedback.length >= 10) {
                                handleAction(job.id, assignment.candidate.id, 'reject', feedback)
                              } else {
                                alert('Please enter a minimum of 10 characters')
                              }
                            }}
                            className="text-xs bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Confirm Reject
                          </button>
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

      {/* *** SIT-IN CONFIRMATION MODAL *** */}
      {interviewPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setInterviewPrompt(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-[#0f172a] mb-2">Request Interview</h3>
            <p className="text-slate-500 text-sm mb-4">
              You are about to request an interview for this candidate. Do you want to sit in on the interview with the Admin?
            </p>

            <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 mb-4">
              <input
                type="checkbox"
                checked={wantToAttend}
                onChange={(e) => setWantToAttend(e.target.checked)}
                className="w-4 h-4 mt-1"
              />
              <div>
                <p className="text-sm font-medium text-[#0f172a]">Yes, I want to sit in on the interview</p>
                <p className="text-xs text-slate-500 mt-1">The Admin will see your request and can still adjust the panel if needed.</p>
              </div>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => setInterviewPrompt(null)}
                className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-full font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={submitInterviewRequest}
                className="flex-1 bg-black text-white py-3 rounded-full font-semibold text-sm hover:bg-slate-800"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
            )}

      {/* *** HIRE REQUEST MODAL *** */}
      {hirePrompt && (
        <HireRequestModal
          jobId={hirePrompt.jobId}
          candidateId={hirePrompt.candidateId}
          jobTitle={hirePrompt.jobTitle}
          onClose={() => setHirePrompt(null)}
          onSuccess={() => {
            setHirePrompt(null)
            alert('Hire request sent! Admin will review and generate the invoice.')
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}