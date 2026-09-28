import Link from 'next/link'
import { CreditCard, ArrowRight } from 'lucide-react'

type Subscription = {
  tier: string
  status: string
  startedAt: Date | string
  expiresAt: Date | string
  renewalAmount: number
}

const TIER_INFO: Record<string, { discount: number; hires: string }> = {
  starter:    { discount: 50, hires: 'Up to 3 hires/month' },
  growth:     { discount: 25, hires: 'Up to 10 hires/month' },
  enterprise: { discount: 15, hires: 'Unlimited hires' },
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function SubscriptionCard({
  subscription,
}: {
  subscription: Subscription
}) {
  const info = TIER_INFO[subscription.tier]
  if (!info) return null

  const expiresAt = new Date(subscription.expiresAt)
  const daysLeft = Math.ceil((expiresAt.getTime() - Date.now()) / 86400000)
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 30

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#facc15] flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#0f172a]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0f172a]">Annual Subscription</h2>
            <p className="text-xs text-slate-500">Active plan</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
          Active
        </span>
      </div>

      {/* Tier summary */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
            Your Tier
          </p>
          <p className="text-2xl font-bold text-[#0f172a] capitalize">
            {subscription.tier}
          </p>
          <p className="text-sm text-slate-500">{info.hires}</p>
        </div>
        <div className="md:text-right">
          <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
            Your Discount
          </p>
          <p className="text-2xl font-bold text-emerald-600">
            {info.discount}% off
          </p>
          <p className="text-sm text-slate-500">applied to every hire</p>
        </div>
      </div>

      {/* Dates grid */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl mb-5">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
            Started
          </p>
          <p className="text-sm font-medium text-slate-800">
            {formatDate(subscription.startedAt)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
            Expires
          </p>
          <p className="text-sm font-medium text-slate-800">
            {formatDate(expiresAt)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
            Days Left
          </p>
          <p
            className={`text-sm font-medium ${
              isExpiringSoon ? 'text-amber-600' : 'text-slate-800'
            }`}
          >
            {daysLeft} days
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <p className="text-sm text-slate-500">
          Renews at{' '}
          <span className="font-semibold text-slate-700">
            ${subscription.renewalAmount.toLocaleString()}/year
          </span>
          <span className="text-slate-400"> • 20% loyalty discount</span>
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline no-underline self-start md:self-auto"
        >
          Upgrade or renew <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}