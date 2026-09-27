'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X } from 'lucide-react'

type Member = {
  id: string
  name: string
  role: string
  bio: string
  imageUrl: string | null
  order: number
  active: boolean
}

export default function WebsiteTeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Member | null>(null)
  const [showModal, setShowModal] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/cms/team')
      const data = await res.json()
      setMembers(data.members || [])
    } catch {
      toast.error('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/cms/team/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Member deleted')
        load()
      } else {
        toast.error('Failed to delete')
      }
    } catch {
      toast.error('Network error')
    }
  }

  const handleToggleActive = async (m: Member) => {
    try {
      const res = await fetch(`/api/cms/team/${m.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !m.active }),
      })
      if (res.ok) {
        toast.success(m.active ? 'Hidden from public' : 'Now visible')
        load()
      } else {
        toast.error('Failed to update')
      }
    } catch {
      toast.error('Network error')
    }
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-start gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Website Team</h1>
          <p className="text-slate-500">Manage who appears on the public /team page.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true) }}
          className="bg-black text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">No team members yet.</p>
          <button
            onClick={() => { setEditing(null); setShowModal(true) }}
            className="bg-black text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-800"
          >
            Add Your First Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {m.imageUrl ? (
                <div className="w-full aspect-[4/5] bg-slate-100 overflow-hidden">
                  <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover object-top" />
                </div>
              ) : (
                <div className="w-full aspect-[4/5] bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">No image</span>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-[#0f172a] truncate">{m.name}</h3>
                  {!m.active && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full shrink-0">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-[#0f172a] text-xs font-semibold mb-3 truncate">{m.role}</p>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => { setEditing(m); setShowModal(true) }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(m)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                  >
                    {m.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {m.active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id, m.name)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <MemberModal
          member={editing}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); load() }}
        />
      )}
    </div>
  )
}

function MemberModal({
  member,
  onClose,
  onSave,
}: {
  member: Member | null
  onClose: () => void
  onSave: () => void
}) {
  const [name, setName] = useState(member?.name || '')
  const [role, setRole] = useState(member?.role || '')
  const [bio, setBio] = useState(member?.bio || '')
  const [imageUrl, setImageUrl] = useState(member?.imageUrl || '')
  const [order, setOrder] = useState(member?.order?.toString() || '0')
  const [active, setActive] = useState(member?.active ?? true)
  const [saving, setSaving] = useState(false)

  const inputClass = 'w-full p-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#facc15]'
  const labelClass = 'block text-sm font-semibold text-slate-700 mb-1'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !role || !bio) {
      toast.error('Name, role, and bio are required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name, role, bio,
        imageUrl: imageUrl || null,
        order: parseInt(order) || 0,
        active,
      }
      const url = member ? `/api/cms/team/${member.id}` : '/api/cms/team'
      const method = member ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(member ? 'Member updated' : 'Member added')
        onSave()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to save')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-lg w-full my-8 max-h-[calc(100vh-4rem)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-[#0f172a]">
            {member ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className={labelClass}>Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Adnan Riaz" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Role *</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Founder" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bio *</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Full bio. Use blank lines to separate paragraphs."
              rows={6}
              className={inputClass + ' resize-none'}
            />
          </div>
          <div>
            <label className={labelClass}>Image URL</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/riaz.png or https://..."
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Order</label>
              <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className={inputClass} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4" />
                <span className="text-sm font-medium text-slate-700">Visible</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-full font-semibold text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-black text-white py-3 rounded-full font-semibold text-sm disabled:opacity-60">
              {saving ? 'Saving...' : (member ? 'Save Changes' : 'Add Member')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}