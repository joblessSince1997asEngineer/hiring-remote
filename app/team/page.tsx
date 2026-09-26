'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function TeamPage() {
  const team = [
    { name: 'Adnan Riaz', role: 'Founder', desc: `My name is Adnan Riaz. I completed my graduation from the University of Karachi through Government Commerce and Arts College. After that, I pursued an M.A. in Economics, but due to the COVID-19 pandemic, I had to discontinue my studies for some time.\n\nLater, I continued my learning through self-study and explored different subjects, including jurisprudence, pharmacopoeia, and other areas of interest. In terms of professional experience, I have worked across various departments, including Finance, Operations, and Human Resources.\n\nThis has given me a broad understanding of how different departments function and work together. However, my strongest preference is Accounting. I genuinely enjoy accounting and feel that it is the field where I can perform at my best.\n\nI have a strong interest in accounting, and I would be very happy to build my career and contribute professionally in an accounting role.`, img: '/riaz.png' },
    { name: 'Mubashir Ali', role: 'Chief Of Executive', desc: `As CEO of RemoteHirring, I lead our mission to revolutionize how global talent connects with top-tier opportunities.\n\nMy journey is rooted in technical execution—transitioning from a background in technology education, complex data analytics (using Python and Power BI), and software architecture into strategic leadership. Today, I combine that technical foundation with overarching business strategy.\n\nSpearheading RemoteHirring's go-to-market execution, client acquisition, and scalable platform operations. Looking ahead, my focus is on capturing new opportunities in the remote work sector by scaling our global footprint.\n\nIntegrating advanced data-driven matching systems, and establishing RemoteHirring as the definitive ecosystem for the future of decentralized work.`, img: '/mubashir.png' },
    { name: 'Syed Sabtain Ali Rizvi', role: 'Head Of Recruitment', desc: `I'm a Recruitment Professional and part of the Remote Hiring Team, specializing in connecting talented professionals with the right career opportunities across global and remote markets.\n\nWith a strong understanding of technology and business, I focus on identifying the right talent, understanding client requirements, and building successful long-term professional connections.`, img: '/syed.png' },
    { name: 'Muhammad Faraz', role: 'SEO Specialist', desc: `Expert in Marketing with a proven track record of driving organic growth, optimizing digital presence, and implementing data-driven strategies.\n\nEnhancing brand visibility and engagement across global markets.`, img: '/faraz.png' },
    { name: 'Ambreen Ashraf', role: 'Legal & Compliance Expert', desc: `Knows Jurisprudence of Corporate Law, ensuring that RemoteHirring operates under the highest standards of legal integrity.\n\nRegulatory compliance, and ethical business practices across all international markets.`, img: '/ambreen.png' },
    { name: 'Ulishba Arif Malik', role: 'Recruitment Specialist', desc: `Knows the methodology to recruit, effectively identifying, sourcing, and placing top-tier talent.\n\nEnsuring a seamless and engaging experience for both candidates and clients.`, img: '/ulishba.png' }
  ]

  const [selected, setSelected] = useState<any | null>(null)

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {team.map((member, index) => (
            <TeamCard key={index} member={member} onOpen={() => setSelected(member)} />
          ))}
        </div>
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
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            {/* Photo — small + centered at top */}
            <div className="pt-8 pb-5 flex justify-center bg-slate-50 shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden bg-slate-200 ring-4 ring-white shadow-lg">
                <img
                  src={selected.img}
                  alt={selected.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Info — scrollable if content is long */}
            <div className="p-6 md:p-8 text-center overflow-y-auto flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-1">
                {selected.name}
              </h2>
              <p className="text-[#0f172a] text-sm font-semibold mb-6">{selected.role}</p>

              <div className="text-slate-600 leading-relaxed text-[15px] space-y-4 text-left">
                {selected.desc.split('\n\n').map((para: string, i: number) => (
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

// Always truncate to first ~150 chars of the first paragraph
const PREVIEW_LENGTH = 150

function TeamCard({ member, onOpen }: { member: any; onOpen: () => void }) {
  // Always truncate — real bios will be long
  const firstPara = member.desc.split('\n\n')[0].trim()
  const clean = firstPara.replace(/\s+/g, ' ').trim()
  const cut = clean.slice(0, PREVIEW_LENGTH)
  const lastSpace = cut.lastIndexOf(' ')
  const preview = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…'

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">

      {/* Photo */}
      <div className="w-full aspect-[4/5] overflow-hidden bg-slate-100">
        <img
          src={member.img}
          alt={member.name}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-[#0f172a] mb-1">{member.name}</h3>
        <p className="text-[#0f172a] text-sm font-semibold mb-3">{member.role}</p>

        <p className="text-slate-600 text-sm leading-relaxed flex-1">
          {preview}
        </p>

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