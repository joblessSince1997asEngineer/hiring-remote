'use client'

import { toast } from 'sonner'
import { useState } from 'react'

export default function ClientRequestsView({ requests }: { requests: any[] }) {
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleApprove = async (request: any) => {
    setActionLoading(request.id)
    try {
      const res = await fetch('/api/client-requests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id }),
      })
      if (res.ok) {
        toast.success('Request approved! A new job has been posted.')
        window.location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Approval failed')
      }
    } catch (err) {
      toast.error('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId: string) => {
    const reason = prompt('Why are you rejecting this request?')
    if (!reason) return
    setActionLoading(requestId)
    try {
      const res = await fetch('/api/client-requests/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, reason }),
      })
      if (res.ok) {
        toast.success('Request rejected.')
        window.location.reload()
      }
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending_review: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }
    return styles[status] || styles.pending_review
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
        <p className="text-slate-400 text-sm">No client requests yet. They will appear here once companies submit hiring requests via the public page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const isExpanded = expandedRequest === request.id
        return (
          <div key={request.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div
              onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
              className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-[#0f172a]">{request.role_title}</h3>
                  <p className="text-slate-500 text-sm">{request.company_name}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${getStatusBadge(request.status)}`}>
                  {request.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-3">
                <span>💰 ${request.budget_min}k - ${request.budget_max}k</span>
                <span>📧 {request.contact_email}</span>
                <span>🕒 {request.working_hours}</span>
              </div>
            </div>

            {isExpanded && (
              <div className="px-6 pb-6 border-t border-slate-100">
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(request.tech_stack) && request.tech_stack.map((tech: string) => (
                      <span key={tech} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs">{tech}</span>
                    ))}
                  </div>

                  {request.status === 'pending_review' && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => handleApprove(request)}
                        disabled={actionLoading === request.id}
                        className="bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoading === request.id ? 'Approving...' : 'Approve & Create Job'}
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={actionLoading === request.id}
                        className="border border-red-500 text-red-500 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}