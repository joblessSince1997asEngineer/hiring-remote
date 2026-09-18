'use client'

import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { Calendar, Clock, Video, X, CheckCircle2, Lock } from 'lucide-react'

export default function InterviewsView({
  interviews,
  canSchedule,
  role,
}: {
  interviews: any[]
  canSchedule: boolean
  role: string
}) {
  const [schedulingInterview, setSchedulingInterview] = useState<any>(null)
  const [filter, setFilter] = useState<string>('all')
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const isAdmin = role === 'admin' || role === 'super_admin'

  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    timeZone: 'UTC',
    videoLink: '',
    clientNotes: '',
    candidateNotes: '',
  })

  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch('/api/team-members')
        const data = await res.json()
        if (data.members) setTeamMembers(data.members)
      } catch (err) {
        console.error('Failed to load team members:', err)
      }
    }
    loadMembers()
  }, [])

  const toggleInterviewer = (userId: string) => {
    setSelectedInterviewers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedInterviewers.length === 0) {
      toast.error('Please select at least one interviewer.')
      return
    }

    const combinedDate = new Date(`${formData.scheduledDate}T${formData.scheduledTime}:00`).toISOString()

    try {
      const res = await fetch('/api/interviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId: schedulingInterview.id,
          scheduledDate: combinedDate,
          timeZone: formData.timeZone,
          videoLink: formData.videoLink,
          clientNotes: formData.clientNotes,
          candidateNotes: formData.candidateNotes,
          interviewers: selectedInterviewers,
        }),
      })

      if (res.ok) {
        toast.success('Interview Scheduled & Emails Sent!')
        window.location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to schedule')
      }
    } catch (err) {
      toast.error('Network error')
    }
  }

  // NEW: Admin directly completes interview
  const handleMarkComplete = async (interviewId: string) => {
    setActionLoading(interviewId)
    try {
      const res = await fetch('/api/interview-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId }),
      })
      if (res.ok) {
        toast.success('Interview marked as complete!')
        window.location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed')
      }
    } catch (err) {
      toast.error('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  // NEW: Client requests completion (admin confirms)
  const handleRequestComplete = async (interviewId: string) => {
    setActionLoading(interviewId)
    try {
      const res = await fetch('/api/interview-request-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId }),
      })
      if (res.ok) {
        toast.success('Sent to admin for confirmation!')
        window.location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed')
      }
    } catch (err) {
      toast.error('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredInterviews = filter === 'all' ? interviews : interviews.filter(i => i.status === filter)

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      scheduled: 'bg-blue-100 text-blue-700',
      completion_requested: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return styles[status] || styles.pending
  }

  const getStatusLabel = (status: string) => {
    const labels: any = {
      pending: 'Pending',
      scheduled: 'Scheduled',
      completion_requested: 'Awaiting Confirmation',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }
    return labels[status] || status
  }

  return (
    <>
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-2">
        {['all', 'pending', 'scheduled', 'completion_requested', 'completed', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-[#0f172a] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f === 'completion_requested' ? 'Awaiting Confirm' : f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">App ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Candidate</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Job</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Requested By</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Scheduled For</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">No interviews found.</td>
                </tr>
              ) : (
                filteredInterviews.map((interview) => (
                  <tr key={interview.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-400 text-xs font-mono">{interview.applicationId?.slice(-6) || 'N/A'}</td>
                    <td className="p-4 font-medium text-[#0f172a] text-sm">Candidate #{interview.candidateId?.slice(-4) || 'N/A'}</td>
                    <td className="p-4 text-slate-600 text-sm">{interview.job?.title || 'Unknown Job'}</td>
                    <td className="p-4 text-slate-600 text-sm capitalize">{interview.requestedBy}</td>
                    <td className="p-4 text-slate-600 text-sm">
                      {interview.scheduledDate ? new Date(interview.scheduledDate).toLocaleString() : <span className="text-slate-400">Not Scheduled</span>}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(interview.status)}`}>
                        {getStatusLabel(interview.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      {/* Pending → Schedule button (admin) or waiting (client) */}
                      {interview.status === 'pending' && canSchedule && (
                        <button
                          onClick={() => {
                            setSchedulingInterview(interview);
                            if (interview.clientRequestedToAttend && interview.requestedByUserId) {
                              setSelectedInterviewers([interview.requestedByUserId]);
                            } else {
                              setSelectedInterviewers([]);
                            }
                          }}
                          className="bg-black text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-slate-800"
                        >
                          Schedule
                        </button>
                      )}
                      {interview.status === 'pending' && !canSchedule && (
                        <span className="text-xs text-slate-400">Awaiting Admin</span>
                      )}

                      {/* Scheduled → admin can mark complete directly, client can request */}
                      {interview.status === 'scheduled' && isAdmin && (
                        <button
                          onClick={() => handleMarkComplete(interview.id)}
                          disabled={actionLoading === interview.id}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {actionLoading === interview.id ? 'Saving...' : 'Mark Complete'}
                        </button>
                      )}
                      {interview.status === 'scheduled' && !isAdmin && (
                        <button
                          onClick={() => handleRequestComplete(interview.id)}
                          disabled={actionLoading === interview.id}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                          {actionLoading === interview.id ? 'Sending...' : 'Mark Done'}
                        </button>
                      )}

                      {/* completion_requested → only admin can confirm */}
                      {interview.status === 'completion_requested' && isAdmin && (
                        <button
                          onClick={() => handleMarkComplete(interview.id)}
                          disabled={actionLoading === interview.id}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-purple-700 disabled:opacity-50"
                        >
                          {actionLoading === interview.id ? 'Confirming...' : 'Confirm Complete'}
                        </button>
                      )}
                      {interview.status === 'completion_requested' && !isAdmin && (
                        <span className="text-xs text-purple-600">Waiting for admin</span>
                      )}

                      {/* completed → lock indicator */}
                      {interview.status === 'completed' && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Done
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {schedulingInterview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSchedulingInterview(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSchedulingInterview(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <h2 className="text-2xl font-bold text-[#0f172a] mb-1">Schedule Interview</h2>
            <p className="text-slate-500 text-sm mb-6">For <strong>Candidate #{schedulingInterview.candidateId?.slice(-4)}</strong></p>

            <form onSubmit={handleSchedule} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Calendar className="w-4 h-4" /> Date</label>
                  <input type="date" required value={formData.scheduledDate} onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Clock className="w-4 h-4" /> Time</label>
                  <input type="time" required value={formData.scheduledTime} onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time Zone</label>
                <select value={formData.timeZone} onChange={(e) => setFormData({...formData, timeZone: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white">
                  <option value="UTC">UTC</option>
                  <option value="EST">EST (New York)</option>
                  <option value="PST">PST (Los Angeles)</option>
                  <option value="GMT">GMT (London)</option>
                  <option value="IST">IST (India)</option>
                  <option value="SGT">SGT (Singapore)</option>
                  <option value="AEST">AEST (Sydney)</option>
                </select>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <label className="block text-sm font-semibold mb-3 text-[#0f172a]">Interview Panel (Select Participants)</label>

                {schedulingInterview?.clientRequestedToAttend && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
                    ⚠️ The Client requested to sit in on this interview. They are pre-selected, but you can remove them if needed.
                  </p>
                )}

                {teamMembers.length === 0 ? (
                  <p className="text-xs text-slate-400">Loading team members...</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <label key={member.userId} className="flex items-center gap-3 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={selectedInterviewers.includes(member.userId)}
                          onChange={() => toggleInterviewer(member.userId)}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-700">{member.email}</span>
                        <span className="text-xs text-slate-400 capitalize">({member.role})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Video className="w-4 h-4" /> Video Call Link</label>
                <input type="url" required placeholder="https://meet.google.com/abc-defg-hij" value={formData.videoLink} onChange={(e) => setFormData({...formData, videoLink: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes for Client / Panel</label>
                <textarea rows={2} placeholder="e.g., Please focus on React performance." value={formData.clientNotes} onChange={(e) => setFormData({...formData, clientNotes: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes for Candidate</label>
                <textarea rows={2} placeholder="e.g., Prepare a system design demo." value={formData.candidateNotes} onChange={(e) => setFormData({...formData, candidateNotes: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
              </div>

              <button type="submit" className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-slate-800">
                Schedule & Send Emails
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}