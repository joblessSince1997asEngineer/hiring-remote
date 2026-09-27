'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, X } from 'lucide-react'

type PendingInvoice = {
  id: string
  invoiceNumber: string
  amount: number
  dueAt: string
}

export default function InvoiceAlert({ invoices }: { invoices: PendingInvoice[] }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || invoices.length === 0) return null

  // Get the most urgent invoice (soonest due)
  const soonest = invoices[0]
  const dueAt = new Date(soonest.dueAt)
  const daysLeft = Math.ceil((dueAt.getTime() - Date.now()) / 86400000)

  // Color based on urgency
  const isUrgent = daysLeft <= 3
  const isMedium = daysLeft <= 7

  const bgClass = isUrgent
    ? 'bg-red-50 border-red-200'
    : isMedium
      ? 'bg-amber-50 border-amber-200'
      : 'bg-blue-50 border-blue-200'

  const textClass = isUrgent
    ? 'text-red-800'
    : isMedium
      ? 'text-amber-800'
      : 'text-blue-800'

  const iconClass = isUrgent
    ? 'text-red-600'
    : isMedium
      ? 'text-amber-600'
      : 'text-blue-600'

  const label = isUrgent
    ? 'Urgent — payment overdue soon'
    : isMedium
      ? 'Payment due soon'
      : 'Payment reminder'

  return (
    <div className={`relative border rounded-2xl p-4 mb-6 flex items-start gap-3 ${bgClass}`}>
      <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${textClass}`}>{label}</p>
        <p className={`text-xs mt-1 ${textClass}`}>
          {invoices.length === 1
            ? `Invoice ${soonest.invoiceNumber} for $${soonest.amount.toLocaleString()} is due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}.`
            : `You have ${invoices.length} unpaid invoices. The soonest is due in ${daysLeft} day${daysLeft === 1 ? '' : 's'} — $${soonest.amount.toLocaleString()}.`
          }
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
                    <Link
            href={`/invoice?id=${soonest.id}`}
            className="inline-block bg-[#0f172a] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-slate-800 transition no-underline"
          >
            Pay Now
          </Link>
          {invoices.length > 1 && (
            <Link
              href="/dashboard/applications"
              className="inline-block border border-slate-300 text-slate-700 px-4 py-2 rounded-full text-xs font-semibold hover:bg-white transition no-underline"
            >
              View All ({invoices.length})
            </Link>
          )}
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className={`shrink-0 p-1 rounded-full hover:bg-white/60 transition ${iconClass}`}
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}