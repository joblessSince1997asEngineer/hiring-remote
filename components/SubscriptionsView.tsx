'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, X, Loader2, Check, AlertCircle } from 'lucide-react'

type Subscription = {
  id: string
  userId: string
  clientEmail: string
  tier: string
  status: string
  startedAt: string
  expiresAt: string
  firstPaymentAmount: number
  renewalAmount: number
  renewalReminderSentAt: string | null
}

type EligibleUser = { id: string; email: string }

const TIER_DISCOUNTS: Record<string, number> = {
  starter: 50,
  growth: 25,
  enterprise: 15,
}

const TIER_LABELS: Record<string, string> = {
  starter: 'Starter — 50% off',
  growth: 'Growth — 25% off',
  enterprise: 'Enterprise — 15% off',
}

const STATUS_STYLES: Record<string, string> = {
  active:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired:   'bg-slate-100 text-slate-600 border-slate-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

export default function SubscriptionsView({
  subscriptions,
  eligibleUsers,
}: {
  subscriptions: Subscription[]
  eligibleUsers: EligibleUser[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  // Add modal
  const [showAdd, setShowAdd] = useState(false)
  const [addUserId, setAddUserId] = useState('')
  const [addTier, setAddTier] = useState('growth')
  const [addDays, setAddDays] = useState(365)

  // Edit modal
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [editTier, setEditTier] = useState('')
  const [editExpiresAt, setEditExpiresAt] = useState('')

  function refresh() {
    startTransition(() => router.refresh())
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!addUserId) return setError('Pick a client')
    const res = await fetch('/api/cms/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: addUserId,
        tier: addTier,
        durationDays: addDays,
      }),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error || 'Failed')
    setShowAdd(false)
    setAddUserId('')
    setAddTier('growth')
    setAddDays(365)
    refresh()
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setError('')
    const res = await fetch(`/api/cms/subscriptions/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tier: editTier,
        expiresAt: editExpiresAt,
      }),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error || 'Failed')
    setEditing(null)
    refresh()
  }

  async function handleCancel(sub: Subscription) {
    if (!confirm(`Cancel subscription for ${sub.clientEmail}?`)) return
    setBusyId(sub.id)
    setError('')
    const res = await fetch(`/api/cms/subscriptions/${sub.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    const data = await res.json()
    setBusyId(null)
    if (!res.ok) return setError(data.error || 'Failed')
    refresh()
  }

  async function handleReactivate(sub: Subscription) {
    if (!confirm(`Reactivate subscription for ${sub.clientEmail} for 365 more days?`))
      return
    setBusyId(sub.id)
    setError('')
    const nextYear = new Date()
    nextYear.setDate(nextYear.getDate() + 365)
    const res = await fetch(`/api/cms/subscriptions/${sub.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'active',
        expiresAt: nextYear.toISOString(),
        renewalReminderSentAt: null,
      }),
    })
    const data = await res.json()
    setBusyId(null)
    if (!res.ok) return setError(data.error || 'Failed')
    refresh()
  }

  function openEdit(sub: Subscription) {
    setEditing(sub)
    setEditTier(sub.tier)
    // format as yyyy-MM-dd for <input type="date">
    setEditExpiresAt(new Date(sub.expiresAt).toISOString().slice(0, 10))
  }

  function daysLeft(iso: string) {
    return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
  }

  return (
    <>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-sm text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-slate-500">
          {subscriptions.length} subscription{subscriptions.length === 1 ? '' : 's'}
        </p>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" /> Add Subscription
        </button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center bg-white">
          <p className="text-slate-500">No subscriptions yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Client</th>
                  <th className="text-left px-5 py-3 font-medium">Tier</th>
                  <th className="text-left px-5 py-3 font-medium">Discount</th>
                  <th className="text-left px-5 py-3 font-medium">Started</th>
                  <th className="text-left px-5 py-3 font-medium">Expires</th>
                  <th className="text-left px-5 py-3 font-medium">Days Left</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.map(sub => {
                  const dl = daysLeft(sub.expiresAt)
                  const style = STATUS_STYLES[sub.status] ?? STATUS_STYLES.expired
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 text-slate-800 font-medium">
                        {sub.clientEmail}
                      </td>
                      <td className="px-5 py-3 text-slate-700 capitalize">{sub.tier}</td>
                      <td className="px-5 py-3 text-slate-700">
                        {TIER_DISCOUNTS[sub.tier] ?? 0}% off
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {new Date(sub.startedAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {new Date(sub.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        {sub.status === 'active' ? (
                          <span className={dl < 30 ? 'text-amber-600 font-medium' : 'text-slate-500'}>
                            {dl > 0 ? `${dl} days` : 'past'}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${style}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {sub.status === 'active' && (
                          <>
                            <button
                              onClick={() => openEdit(sub)}
                              className="text-blue-600 hover:underline text-xs font-medium inline-flex items-center gap-1 mr-3"
                            >
                              <Pencil className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleCancel(sub)}
                              disabled={busyId === sub.id}
                              className="text-red-600 hover:underline text-xs font-medium disabled:opacity-50"
                            >
                              {busyId === sub.id ? '…' : 'Cancel'}
                            </button>
                          </>
                        )}
                        {sub.status !== 'active' && (
                          <button
                            onClick={() => handleReactivate(sub)}
                            disabled={busyId === sub.id}
                            className="text-emerald-600 hover:underline text-xs font-medium disabled:opacity-50"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------- Add modal ---------- */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#0f172a]">Add Subscription</h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Client
                </label>
                {eligibleUsers.length === 0 ? (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    All clients already have a subscription, or no recruiters exist yet.
                  </p>
                ) : (
                  <select
                    value={addUserId}
                    onChange={e => setAddUserId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
                  >
                    <option value="">Select a client…</option>
                    {eligibleUsers.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Tier
                </label>
                <select
                  value={addTier}
                  onChange={e => setAddTier(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
                >
                  {Object.entries(TIER_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={addDays}
                  onChange={e => setAddDays(Number(e.target.value))}
                  min={1}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Default 365. First-year pricing $5,000.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 border border-slate-200 rounded-full py-2.5 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!addUserId || isPending}
                  className="flex-1 bg-[#0f172a] text-white rounded-full py-2.5 text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- Edit modal ---------- */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#0f172a]">Edit Subscription</h2>
              <button
                onClick={() => setEditing(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">{editing.clientEmail}</p>

            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Tier
                </label>
                <select
                  value={editTier}
                  onChange={e => setEditTier(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
                >
                  {Object.entries(TIER_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Expires At
                </label>
                <input
                  type="date"
                  value={editExpiresAt}
                  onChange={e => setEditExpiresAt(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="flex-1 border border-slate-200 rounded-full py-2.5 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-[#0f172a] text-white rounded-full py-2.5 text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}