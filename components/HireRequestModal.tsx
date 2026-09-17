'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

type Props = {
  jobId: string
  candidateId: string
  jobTitle: string
  onClose: () => void
  onSuccess: () => void
}

export default function HireRequestModal({
  jobId,
  candidateId,
  jobTitle,
  onClose,
  onSuccess,
}: Props) {
  const [plan, setPlan] = useState<'percentage' | 'flat'>('percentage')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/hire-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, candidateId, planType: plan, notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send request')
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-[#0f172a] mb-1">
          Request to Hire
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          Sending hire request for <strong>{jobTitle}</strong> to admin for approval.
        </p>

        {/* Plan selection */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Which pricing plan applies?
          </p>

          <label
            className={`block p-4 border-2 rounded-xl cursor-pointer mb-3 transition-colors ${
              plan === 'percentage'
                ? 'border-[#facc15] bg-[#fffbeb]'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="plan"
                value="percentage"
                checked={plan === 'percentage'}
                onChange={() => setPlan('percentage')}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-bold text-[#0f172a]">One-Time % of Salary</p>
                <p className="text-xs text-slate-500 mt-1 mb-2">
                  Fee is a percentage of the candidate's annual salary.
                </p>
                <div className="text-xs text-slate-600 space-y-0.5">
                  <p>• Junior: 15%</p>
                  <p>• Mid-Level: 25%</p>
                  <p>• Senior / Specialized: 40%</p>
                </div>
              </div>
            </div>
          </label>

          <label
            className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${
              plan === 'flat'
                ? 'border-[#facc15] bg-[#fffbeb]'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="plan"
                value="flat"
                checked={plan === 'flat'}
                onChange={() => setPlan('flat')}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-bold text-[#0f172a]">Flat Fee per Hire</p>
                <p className="text-xs text-slate-500 mt-1 mb-2">
                  Fixed price per placement, regardless of salary.
                </p>
                <div className="text-xs text-slate-600 space-y-0.5">
                  <p>• Entry-Level: $300</p>
                  <p>• Mid-Level: $500</p>
                  <p>• Senior / Specialized: $1,000</p>
                </div>
              </div>
            </div>
          </label>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Message to admin <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific details about this hire..."
            rows={3}
            className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#facc15] resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        <p className="text-xs text-slate-400 mb-6">
          The admin will review and generate the invoice. You won't be charged until admin approves.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-full font-semibold text-sm hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-black text-white py-3 rounded-full font-semibold text-sm hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send Hire Request'}
          </button>
        </div>
      </div>
    </div>
  )
}