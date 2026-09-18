'use client'
import { useState } from 'react'
import { Mail, Building2, Check, Clock, Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactMessagesView({ messages }: { messages: any[] }) {
  const [list, setList] = useState(messages)
  const [selected, setSelected] = useState<any>(messages[0] || null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  const filtered = list.filter(m => {
    if (filter === 'unread' && m.read) return false
    if (filter === 'read' && !m.read) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.company || '').toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      )
    }
    return true
  })

  const unreadCount = list.filter(m => !m.read).length

  const toggleRead = async (id: string, read: boolean) => {
    setLoading(id)
    try {
      const res = await fetch('/api/contact-messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read }),
      })
      if (res.ok) {
        setList(prev => prev.map(m => m.id === id ? { ...m, read } : m))
        if (selected?.id === id) setSelected({ ...selected, read })
      } else {
        toast.error('Failed to update')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">

      {/* Left Pane */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header: filters + search */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex gap-2 mb-3">
            {(['all', 'unread', 'read'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  filter === f ? 'bg-[#0f172a] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f} {f === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#facc15]"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <p className="p-8 text-center text-slate-400 text-sm">
              {search ? 'No matches.' : 'No messages.'}
            </p>
          ) : (
            filtered.map(m => {
              const isActive = selected?.id === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className={`w-full text-left p-4 border-b border-slate-100 transition-colors ${
                    isActive ? 'bg-slate-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-sm truncate ${m.read ? 'text-slate-600' : 'font-bold text-[#0f172a]'}`}>
                      {m.firstName} {m.lastName}
                    </p>
                    {!m.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{m.company || m.email}</p>
                  <p className="text-xs text-slate-400 truncate mt-1">{m.message.slice(0, 60)}…</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Right Pane */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-h-[80vh] overflow-y-auto">
        {selected ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6 pb-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-[#0f172a]">
                  {selected.firstName} {selected.lastName}
                </h2>
                <p className="text-sm text-slate-500 mt-1">{selected.email}</p>
              </div>
              <button
                onClick={() => toggleRead(selected.id, !selected.read)}
                disabled={loading === selected.id}
                className={`self-start px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  selected.read
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } disabled:opacity-50`}
              >
                {loading === selected.id ? <Loader2 className="w-3 h-3 animate-spin" /> : selected.read ? <Clock className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                {selected.read ? 'Mark as Unread' : 'Mark as Read'}
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                {selected.email}
              </div>
              {selected.company && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {selected.company}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4 text-slate-400" />
                {new Date(selected.createdAt).toLocaleString()}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Message</p>
              <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <a
                href={`mailto:${selected.email}?subject=Re: Your inquiry to Remote Hirring`}
                className="inline-block bg-[#0f172a] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-slate-800"
              >
                Reply via Email
              </a>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
            Select a message to view.
          </div>
        )}
      </div>
    </div>
  )
}