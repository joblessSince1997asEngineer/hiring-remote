'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Bell } from 'lucide-react'
import MarkPaidModal from './MarkPaidModal'

type Props = {
  invoice: {
    id: string
    invoiceNumber: string
    amount: number
    clientEmail: string
    status: string
    paymentNotifiedAt: string | null
  }
}

export default function InvoiceRowActions({ invoice }: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  function handleSuccess() {
    setShowModal(false)
    router.refresh()
  }

  if (invoice.status !== 'pending') return null

  const clientNotified = !!invoice.paymentNotifiedAt

  return (
    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
      {clientNotified && (
        <span
          className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-300 px-2 py-0.5 rounded-full font-medium"
          title={`Client reported payment on ${new Date(invoice.paymentNotifiedAt!).toLocaleString()}`}
        >
          <Bell className="w-2.5 h-2.5" /> Paid?
        </span>
      )}
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition whitespace-nowrap ${
          clientNotified
            ? 'text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100'
            : 'text-slate-600 border-slate-200 bg-white hover:bg-slate-50'
        }`}
        title={
          clientNotified
            ? 'Client reported payment — click to confirm'
            : 'Mark invoice as paid'
        }
      >
        <Check className="w-3 h-3" strokeWidth={3} />
        Mark Paid
      </button>
      {showModal && (
        <MarkPaidModal
          invoice={invoice}
          clientNotified={clientNotified}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}