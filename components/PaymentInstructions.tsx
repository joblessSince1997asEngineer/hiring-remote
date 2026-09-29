'use client'

import { useState } from 'react'
import { Copy, Check, ExternalLink, Building2, CreditCard, Info } from 'lucide-react'

type Props = {
  invoiceId: string
  invoiceNumber: string
  amount: number
  alreadyNotified: boolean
}

export default function PaymentInstructions({
  invoiceId,
  invoiceNumber,
  amount,
  alreadyNotified,
}: Props) {
  const [tab, setTab] = useState<'paypal' | 'bank'>('paypal')
  const [copied, setCopied] = useState<string | null>(null)
  const [notified, setNotified] = useState(alreadyNotified)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const paypalUser = process.env.NEXT_PUBLIC_PAYPAL_ME_USERNAME || 'remotehirring'
  const bankName = process.env.NEXT_PUBLIC_PAYMENT_BANK_NAME || ''
  const bankAccountName = process.env.NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NAME || ''
  const bankAccountNumber = process.env.NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NUMBER || ''
  const bankSortCode = process.env.NEXT_PUBLIC_PAYMENT_BANK_SORT_CODE || ''
  const paypalUrl = `https://paypal.me/${paypalUser}/${amount}`

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleNotifySent() {
    if (!confirm('Confirm you have sent the payment? This will notify our team.')) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/invoice/notify-payment-sent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      setNotified(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const CopyBtn = ({ value, label }: { value: string; label: string }) => (
    <button
      onClick={() => copy(value, label)}
      className="text-slate-400 hover:text-slate-700 transition-colors"
      title={`Copy ${label}`}
    >
      {copied === label ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )

  return (
    <div className="mt-8 pt-6 border-t border-slate-100">
      <p className="text-sm font-semibold text-slate-800 mb-1">Payment Instructions</p>
      <p className="text-xs text-slate-500 mb-5">
        Choose your preferred method below. Use the reference number so we can match your payment.
      </p>

      {/* Amount + Reference summary */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
          <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Amount</p>
          <div className="flex items-center justify-between">
            <span className="font-mono font-semibold text-slate-800">
              ${amount.toLocaleString()}
            </span>
            <CopyBtn value={String(amount)} label="amount" />
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
          <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Reference</p>
          <div className="flex items-center justify-between">
            <span className="font-mono font-semibold text-slate-800 truncate">
              {invoiceNumber}
            </span>
            <CopyBtn value={invoiceNumber} label="reference" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setTab('paypal')}
          className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors inline-flex items-center justify-center gap-2 ${
            tab === 'paypal'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" /> PayPal.me
        </button>
        <button
          onClick={() => setTab('bank')}
          className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors inline-flex items-center justify-center gap-2 ${
            tab === 'bank'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" /> Bank Transfer
        </button>
      </div>

      {/* Tab content */}
      {tab === 'paypal' && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-slate-700 mb-3">
            Send the exact amount using our PayPal.me link. Add the reference in the note.
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">PayPal.me</span>
              <span className="font-mono text-slate-800">@{paypalUser}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Note / Reference</span>
              <span className="font-mono text-slate-800">{invoiceNumber}</span>
            </div>
          </div>
          <a
            href={paypalUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#0070ba] text-white py-3 rounded-full font-semibold text-sm hover:bg-[#005a94] transition inline-flex items-center justify-center gap-2"
          >
            Open PayPal.me <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-xs text-slate-500 mt-3 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Don&apos;t forget the reference — it helps us match your payment faster.
          </p>
        </div>
      )}

      {tab === 'bank' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          {bankName || bankAccountNumber ? (
            <div className="space-y-3">
              {bankName && (
                <div className="flex justify-between text-sm border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Bank</span>
                  <span className="font-medium text-slate-800">{bankName}</span>
                </div>
              )}
              {bankAccountName && (
                <div className="flex justify-between text-sm border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Account Name</span>
                  <span className="font-medium text-slate-800">{bankAccountName}</span>
                </div>
              )}
              {bankSortCode && (
                <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Sort Code</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-slate-800">{bankSortCode}</span>
                    <CopyBtn value={bankSortCode} label="sort code" />
                  </div>
                </div>
              )}
              {bankAccountNumber && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-slate-800">
                      {bankAccountNumber}
                    </span>
                    <CopyBtn value={bankAccountNumber} label="account number" />
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-500 pt-2 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Use <strong>{invoiceNumber}</strong> as the payment reference.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Bank transfer details coming soon. Please contact{' '}
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_PAYMENT_SUPPORT_EMAIL || 'hr@remotehirring.com'}`}
                className="text-blue-600 underline"
              >
                {process.env.NEXT_PUBLIC_PAYMENT_SUPPORT_EMAIL || 'hr@remotehirring.com'}
              </a>
            </p>
          )}
        </div>
      )}

      {/* Notify button */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        {error && (
          <p className="text-xs text-red-600 mb-2">{error}</p>
        )}
        {notified ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800">Payment notification received</p>
              <p className="text-xs text-green-700 mt-0.5">
                Our team will verify and mark this invoice as paid shortly.
              </p>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={handleNotifySent}
              disabled={submitting}
              className="w-full border-2 border-slate-300 text-slate-800 py-3 rounded-full font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-50"
            >
              {submitting ? 'Sending…' : "I've Sent the Payment"}
            </button>
            <p className="text-xs text-slate-500 text-center mt-2">
              Click after sending. This notifies our team to verify your payment.
            </p>
          </>
        )}
      </div>
    </div>
  )
}