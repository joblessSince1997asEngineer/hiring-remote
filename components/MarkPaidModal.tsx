'use client'

import { useState } from 'react'
import { X, Loader2, Check, AlertTriangle, Bell } from 'lucide-react'

type Props = {
  invoice: {
    id: string
    invoiceNumber: string
    amount: number
    clientEmail: string
    paymentNotifiedAt?: string | null
  }
  clientNotified: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function MarkPaidModal({
  invoice,
  clientNotified,
  onClose,
  onSuccess,
}: Props) {
  const [method, setMethod] = useState('paypal_me')
  const [reference, setReference] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Extra safety: warn if client hasn't notified
    if (
      !clientNotified &&
      !confirm(
        'The client has not confirmed sending payment. Mark this invoice as paid anyway?'
      )
    ) {
      return
    }

    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/invoice/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          paymentMethod: method,
          paymentReference: reference,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      onSuccess()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#0f172a]">Mark Invoice as Paid</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client signal banner */}
        {clientNotified ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <Bell className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Client reported payment sent
              </p>
              {invoice.paymentNotifiedAt && (
                <p className="text-xs text-emerald-700 mt-0.5">
                  {new Date(invoice.paymentNotifiedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Client has not confirmed payment
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Only proceed if you&apos;ve verified the payment arrived in your account.
              </p>
            </div>
          </div>
        )}

        <div className="bg-slate-50 rounded-lg p-3 mb-5 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-slate-500">Invoice</span>
            <span className="font-mono font-medium">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-slate-500">Client</span>
            <span className="text-slate-700 text-xs">{invoice.clientEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Amount</span>
            <span className="font-semibold text-slate-900">
              ${invoice.amount.toLocaleString()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
              Payment Method
            </label>
            <select
              value={method}
              onChange={e => setMethod(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
            >
              <option value="paypal_me">PayPal.me</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
              Reference / Note (optional)
            </label>
            <input
              type="text"
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder="e.g. transaction ID or note"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 rounded-full py-2.5 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 text-white rounded-full py-2.5 text-sm font-semibold transition disabled:opacity-50 inline-flex items-center justify-center gap-2 ${
                clientNotified
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-700 hover:bg-slate-800'
              }`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {clientNotified ? 'Confirm Payment' : 'Mark as Paid Anyway'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}