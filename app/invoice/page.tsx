'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calendar, DollarSign, CheckCircle2, Clock } from 'lucide-react'
import PayPalButton from '@/components/PayPalButton'

function InvoiceContent() {
  const searchParams = useSearchParams()
  const invoiceId = searchParams.get('id')

  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      if (!invoiceId) {
        setError('Missing invoice id')
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/invoice?id=${invoiceId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load')
        setInvoice(data.invoice)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [invoiceId])

  if (loading) return <div className="p-8 text-center text-slate-500">Loading invoice...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!invoice) return <div className="p-8 text-center text-red-500">Invoice not found.</div>

  const job = invoice.application?.job
  const isPaid = invoice.status === 'paid'
  const isCancelled = invoice.status === 'cancelled'
  const dueDate = new Date(invoice.dueAt)
  const daysLeft = Math.ceil((dueDate.getTime() - Date.now()) / 86400000)

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-4 flex justify-center">
      <div className="max-w-2xl w-full">

        {/* Header card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0f172a]">Invoice</h1>
              <p className="text-slate-500 text-sm">Remote Hirring</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-slate-500 text-xs uppercase">Invoice #</p>
              <p className="font-mono text-sm text-slate-800">{invoice.invoiceNumber}</p>
            </div>
          </div>
        </div>

        {/* Status banner */}
        {isPaid && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">Paid</p>
              <p className="text-xs text-green-700">
                Paid on {invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <p className="text-sm font-semibold text-red-800">Invoice cancelled</p>
          </div>
        )}

        {!isPaid && !isCancelled && (
          <div
            className={`rounded-2xl p-4 mb-4 flex items-center gap-3 ${
              daysLeft > 5
                ? 'bg-blue-50 border border-blue-200'
                : daysLeft > 0
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-red-50 border border-red-200'
            }`}
          >
            <Clock
              className={`w-5 h-5 shrink-0 ${
                daysLeft > 5 ? 'text-blue-600' : daysLeft > 0 ? 'text-amber-600' : 'text-red-600'
              }`}
            />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {daysLeft > 0 ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left to pay` : 'Payment overdue'}
              </p>
              <p className="text-xs text-slate-600">
                Due by {dueDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* Main card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">

          {/* Bill to */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Billed To</p>
            <p className="text-slate-800 font-medium">{job?.company || '—'}</p>
          </div>

          {/* Job details */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Job</p>
            <p className="text-slate-800 font-medium">{job?.title || '—'}</p>
            {job?.location && <p className="text-sm text-slate-500">{job.location}</p>}
          </div>

          {/* Line items */}
          <div className="mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">
                Placement Fee ({invoice.planType === 'percentage' ? 'One-Time %' : 'Flat Fee'})
              </span>
              <span className="text-slate-800 font-medium">
                ${invoice.baseAmount.toLocaleString()}
              </span>
            </div>

            {invoice.discountPercent > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subscription Discount ({invoice.discountPercent}% off)</span>
                <span className="text-green-600 font-medium">
                  −${(invoice.baseAmount - invoice.amount).toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-slate-200">
              <span className="text-base font-bold text-slate-800">Total Due</span>
              <span className="text-2xl font-bold text-[#0f172a]">
                ${invoice.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Pay Now / Print */}
          {!isPaid && !isCancelled ? (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-800 mb-4">Pay with PayPal or Card</p>
              <PayPalButton
                invoiceId={invoice.id}
                amount={invoice.amount}
                currency={invoice.currency || 'USD'}
              />
            </div>
          ) : (
            <button
              onClick={() => window.print()}
              className="mt-8 w-full border border-slate-300 text-slate-700 py-3 rounded-full font-semibold text-sm hover:bg-slate-50 transition"
            >
              Print Invoice
            </button>
          )}

        </div>
      </div>
    </div>
  )
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}>
      <InvoiceContent />
    </Suspense>
  )
}