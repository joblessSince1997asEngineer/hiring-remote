import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function InvoiceSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md w-full p-8 text-center">

        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-[#0f172a] mb-2">
          Payment Confirmed
        </h1>
        <p className="text-slate-600 text-sm mb-8">
          Thank you! Your payment has been received and the hire is now confirmed. A confirmation email has been sent.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard/applications"
            className="block w-full bg-black text-white py-3 rounded-full font-semibold text-sm hover:bg-slate-800 transition no-underline"
          >
            Back to Applications
          </Link>

          <Link
            href="/account"
            className="block w-full border border-slate-300 text-slate-700 py-3 rounded-full font-semibold text-sm hover:bg-slate-50 transition no-underline"
          >
            My Account
          </Link>
        </div>

      </div>
    </div>
  )
}