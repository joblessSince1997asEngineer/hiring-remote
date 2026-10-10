'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'


type Member = {
  id: string
  name: string
  role: string
  bio: string
  imageUrl: string | null
}

export default function TeamPage() {
  const [team, setTeam] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Member | null>(null)

  useEffect(() => {
    fetch('/api/cms/team')
      .then(r => r.json())
      .then(data => setTeam(data.members || []))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selected])

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-4">Meet Our Team</h1>
          <p className="text-slate-600 text-base md:text-lg">
            The global talent experts dedicated to finding your next great hire.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading team...
          </div>
        ) : team.length === 0 ? (
          <p className="text-center text-slate-500">Team members coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {team.map((member) => (
              <TeamCard key={member.id} member={member} onOpen={() => setSelected(member)} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full my-8 relative overflow-hidden shadow-2xl max-h-[calc(100vh-4rem)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            <div className="pt-8 pb-5 flex justify-center bg-slate-50 shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden bg-slate-200 ring-4 ring-white shadow-lg">
                {selected.imageUrl ? (
                  <img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
                )}
              </div>
            </div>

            <div className="p-6 md:p-8 text-center overflow-y-auto flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-1">
                {selected.name}
              </h2>
              <p className="text-[#0f172a] text-sm font-semibold mb-6">{selected.role}</p>

              <div className="text-slate-600 leading-relaxed text-[15px] space-y-4 text-left">
                {selected.bio.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const PREVIEW_LENGTH = 150

function TeamCard({ member, onOpen }: { member: Member; onOpen: () => void }) {
  const firstPara = member.bio.split('\n\n')[0].trim()
  const clean = firstPara.replace(/\s+/g, ' ').trim()
  const cut = clean.slice(0, PREVIEW_LENGTH)
  const lastSpace = cut.lastIndexOf(' ')
  const preview = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…'

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
      <div className="w-full aspect-[4/5] overflow-hidden bg-slate-100">
        {member.imageUrl ? (
          <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No image</div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-[#0f172a] mb-1">{member.name}</h3>
        <p className="text-[#0f172a] text-sm font-semibold mb-3">{member.role}</p>

        <p className="text-slate-600 text-sm leading-relaxed flex-1">{preview}</p>

        <button
          type="button"
          onClick={onOpen}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#0f172a] hover:opacity-70 transition-opacity self-start"
        >
          Read More →
        </button>
      </div>
    </div>
  )
}