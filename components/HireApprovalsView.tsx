'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { CheckCircle, XCircle, User, Loader2, DollarSign } from 'lucide-react'

export default function HireApprovalsView({
  applications,
  profiles,
  users,
}: {
  applications: any[]
  profiles: any[]
  users: any[]
}) {
  const [approveTarget, setApproveTarget] = useState<any>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  const getProfile = (userId: string) => profiles.find(p => p.userId === userId) || null
  const getUserEmail = (userId: string) => users.find(u => u.id === userId)?.email || '—'

  const handleApprove = async (applicationId: string, planType: string, baseAmount: number) => {
    setProcessing(applicationId)
    try {
      const res = await fetch('/api/hire-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, planType, baseAmount }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Invoice created for $${data.amount.toLocaleString()}`)
        window.location.reload()
      } else {
        toast.error(data.error || 'Approval failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setProcessing(null)
      setApproveTarget(null)
    }
  }

  const handleReject = async (applicationId: string) => {
    const reason = prompt('Rejection reason (min 10 chars):')
    if (!reason || reason.length < 10) {
      if (reason) toast.error('Reason must be at least 10 characters')
      return
    }
    setProcessing(applicationId)
    try {
      const res = await fetch('/api/hire-reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, reason }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Hire request rejected.')
        window.location.reload()
      } else {
        toast.error(data.error || 'Rejection failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setProcessing(null)
    }
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-slate-500">No pending hire requests. All caught up.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {applications.map((app) => {
          const profile = getProfile(app.userId)
          const salary = profile?.expectedSalary || 0
          const suggestedPercentage = salary > 0 ? Math.round(salary * 0.25) : 0

          return (
            <div key={app.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-slate-400" />
                    <h2 className="font-bold text-[#0f172a]">
                      {profile?.fullName || `Candidate #${app.userId.slice(-4)}`}
                    </h2>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      Hire Request
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">
                    {getUserEmail(app.userId)} • Applied for <strong>{app.job?.title}</strong>
                  </p>
                  <p className="text-xs text-slate-400 mb-3">
                    Requested {app.hireRequestedAt ? new Date(app.hireRequestedAt).toLocaleString() : '—'}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Plan</p>
                      <p className="text-slate-800 font-medium">
                        {app.hirePlan === 'percentage' ? 'One-Time %' : 'Flat Fee'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Skill</p>
                      <p className="text-slate-800">{profile?.primarySkill || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Experience</p>
                      <p className="text-slate-800">{profile?.yearsExp ? `${profile.yearsExp} yrs` : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Expected Salary</p>
                      <p className="text-slate-800">{salary ? `$${salary.toLocaleString()}` : '—'}</p>
                    </div>
                  </div>

                  {app.hireNotes && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Client note</p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{app.hireNotes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:w-52 shrink-0">
                  <button
                    onClick={() => setApproveTarget({ app, suggestedPercentage })}
                    disabled={processing === app.id}
                    className="bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Approve & Invoice
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    disabled={processing === app.id}
                    className="border border-red-500 text-red-500 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {approveTarget && (
        <ApproveModal
          target={approveTarget}
          onClose={() => setApproveTarget(null)}
          onSubmit={handleApprove}
        />
      )}
    </>
  )
}

function ApproveModal({
  target,
  onClose,
  onSubmit,
}: {
  target: any
  onClose: () => void
  onSubmit: (applicationId: string, planType: string, baseAmount: number) => void
}) {
  const { app, suggestedPercentage } = target
  const [planType, setPlanType] = useState(app.hirePlan || 'flat')
  const [amount, setAmount] = useState(
    app.hirePlan === 'percentage' && suggestedPercentage ? String(suggestedPercentage) : ''
  )

  const inputClass = 'w-full p-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#facc15]'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-[#0f172a] mb-1">Approve Hire</h3>
        <p className="text-sm text-slate-500 mb-6">
          Set the placement fee for <strong>{app.job?.title}</strong>.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Plan Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPlanType('percentage')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 ${
                  planType === 'percentage'
                    ? 'border-[#facc15] bg-[#fffbeb] text-[#0f172a]'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Percentage
              </button>
              <button
                type="button"
                onClick={() => setPlanType('flat')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 ${
                  planType === 'flat'
                    ? 'border-[#facc15] bg-[#fffbeb] text-[#0f172a]'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Flat Fee
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <DollarSign className="w-4 h-4" /> Amount (USD)
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder={planType === 'percentage' ? 'e.g., 1800' : 'e.g., 500'}
              className={inputClass}
            />
            {planType === 'percentage' && suggestedPercentage > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                Suggested: ${suggestedPercentage.toLocaleString()} (25% of expected salary)
              </p>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              Client will have <strong>15 days</strong> to pay. Invoice sent to their account.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-full font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const n = parseInt(amount)
              if (!n || n <= 0) {
                toast.error('Please enter a valid amount')
                return
              }
              onSubmit(app.id, planType, n)
            }}
            className="flex-1 bg-green-600 text-white py-3 rounded-full font-semibold text-sm hover:bg-green-700"
          >
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  )
}