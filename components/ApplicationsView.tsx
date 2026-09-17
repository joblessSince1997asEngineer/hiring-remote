'use client'
import { useState } from 'react'
import ViewCVButton from '@/components/ViewCVButton'
import HireRequestModal from '@/components/HireRequestModal'
import { CheckCircle, XCircle, Calendar, X } from 'lucide-react'

export default function ApplicationsView({
  applications,
  role,
}: {
  applications: any[]
  role: string
}) {
  const [selectedApp, setSelectedApp] = useState<any>(applications[0] || null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [interviewPrompt, setInterviewPrompt] = useState<any>(null)
  const [wantToAttend, setWantToAttend] = useState(true)
  const [hirePrompt, setHirePrompt] = useState<any>(null)

  const isAdmin = role === 'admin' || role === 'super_admin'

  const handleAction = async (
    jobId: string,
    applicationId: string,
    candidateId: string,
    action: 'interview' | 'reject' | 'hire',
    reason?: string,
    clientRequestedToAttend?: boolean
  ) => {
    setActionLoading(action)
    try {
      const res = await fetch('/api/client-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, applicationId, candidateId, action, feedback: reason, clientRequestedToAttend }),
      })
      if (res.ok) {
        alert(action === 'interview' ? 'Interview Requested!' : action === 'reject' ? 'Candidate Rejected' : 'Candidate Hired!')
        window.location.reload()
      } else {
        const data = await res.json()
        alert(data.error || 'Action failed')
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  const submitInterviewRequest = () => {
    if (!interviewPrompt) return
    handleAction(interviewPrompt.jobId, interviewPrompt.applicationId, interviewPrompt.candidateId, 'interview', undefined, wantToAttend)
    setInterviewPrompt(null)
  }

  const renderFormData = (data: any) => {
    if (!data) return <p className="text-slate-400 text-sm">No additional form data available.</p>

    const fields = [
      { key: 'fullName', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'city', label: 'City' },
      { key: 'university', label: 'University' },
      { key: 'degree', label: 'Degree' },
      { key: 'linkedin', label: 'LinkedIn' },
      { key: 'portfolio', label: 'Portfolio' },
      { key: 'preferredDept', label: 'Preferred Department' },
      { key: 'remoteWork', label: 'Remote Work Preference' },
      { key: 'experience', label: 'Experience' },
      { key: 'proudProject', label: 'Proud Project' },
      { key: 'techSkills', label: 'Technical Skills' },
      { key: 'languages', label: 'Languages' },
      { key: 'achievements', label: 'Achievements' },
      { key: 'motivationJoin', label: 'Why Join?' },
      { key: 'motivationExcites', label: 'What Excites You?' },
      { key: 'motivationValue', label: 'Value You Bring' },
      { key: 'biggestStrength', label: 'Biggest Strength' },
      { key: 'biggestGrowth', label: 'Biggest Growth Area' },
      { key: 'careerGoals', label: 'Career Goals' },
      { key: 'scenarioDeadline', label: 'Scenario: Unclear Deadline' },
      { key: 'scenarioMissDeadline', label: 'Scenario: Miss Deadline' },
      { key: 'scenarioDisagree', label: 'Scenario: Disagreement' },
      { key: 'scenarioNewTask', label: 'Scenario: New Task' },
      { key: 'scenarioSafety', label: 'Scenario: User Safety' },
    ]

    return (
      <div className="space-y-4">
        {fields.map((field) => {
          const value = data[field.key]
          if (!value) return null
          return (
            <div key={field.key} className="border-b border-slate-100 pb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-1">{field.label}</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{value}</p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        
        {/* Left Pane: Application List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-h-[80vh] overflow-y-auto">
          {applications.length === 0 ? (
            <p className="p-8 text-center text-slate-400 text-sm">No applications yet.</p>
          ) : (
            applications.map((app) => {
              const isActive = selectedApp?.id === app.id
              return (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`w-full text-left p-4 border-b border-slate-100 transition-colors
                    ${isActive ? 'bg-slate-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-[#0f172a] text-sm">
                      Candidate #{app.userId.slice(-4)}
                    </p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'hire_pending' ? 'bg-purple-100 text-purple-700' :
                      app.status === 'hired' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {app.status === 'hire_pending' ? 'Hire Pending' : app.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{app.job.title}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </button>
              )
            })
          )}
        </div>

        {/* Right Pane: Application Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-h-[80vh] overflow-y-auto">
          {selectedApp ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold text-[#0f172a]">
                    Candidate #{selectedApp.userId.slice(-4)}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Applied for: <span className="font-medium text-slate-700">{selectedApp.job.title}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedApp.cv_url && <ViewCVButton url={selectedApp.cv_url} />}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => { setInterviewPrompt({ jobId: selectedApp.jobId, applicationId: selectedApp.id, candidateId: selectedApp.userId }); setWantToAttend(true); }}
                  disabled={actionLoading !== null}
                  className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Request Interview
                </button>

                {/* Confirm Hire — different for admin vs client */}
                <button
                  onClick={() => {
                    if (isAdmin) {
                      // Admin: direct hire (unchanged for now)
                      handleAction(selectedApp.jobId, selectedApp.id, selectedApp.userId, 'hire')
                    } else {
                      // Client: open plan picker modal
                      setHirePrompt({
                        jobId: selectedApp.jobId,
                        candidateId: selectedApp.userId,
                        jobTitle: selectedApp.job.title,
                      })
                    }
                  }}
                  disabled={actionLoading !== null}
                  className="bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {actionLoading === 'hire' ? 'Hiring...' : isAdmin ? 'Confirm Hire' : 'Request Hire'}
                </button>

                <button
                  onClick={() => {
                    const reason = prompt('Rejection reason (min 10 chars):')
                    if (reason && reason.length >= 10) handleAction(selectedApp.jobId, selectedApp.id, selectedApp.userId, 'reject', reason)
                    else if (reason) alert('Reason must be at least 10 characters')
                  }}
                  disabled={actionLoading !== null}
                  className="border border-red-500 text-red-500 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>

              {/* Hire request pending info (client view) */}
              {!isAdmin && selectedApp.status === 'hire_pending' && (
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800 font-medium">
                    Hire request sent to admin for approval.
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    Plan: {selectedApp.hirePlan === 'percentage' ? 'One-Time %' : 'Flat Fee'}
                    {selectedApp.hireNotes && ` • Note: ${selectedApp.hireNotes}`}
                  </p>
                </div>
              )}

              {selectedApp.coverLetter && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Cover Letter</p>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-4">Full Application Answers</p>
                {renderFormData(selectedApp.formData)}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
              Select an application from the left to view details.
            </div>
          )}
        </div>
      </div>

      {/* *** SIT-IN CONFIRMATION MODAL *** */}
      {interviewPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setInterviewPrompt(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setInterviewPrompt(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

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

      {/* *** HIRE REQUEST MODAL (client only) *** */}
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
    </>
  )
}