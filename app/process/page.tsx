import { FileText, Search, ShieldCheck, Briefcase } from 'lucide-react'

export default function ProcessPage() {
  const steps = [
    { icon: <FileText size={28} />, title: 'Company Submits Requirements', desc: 'You provide detailed information about the role, required skills, company culture, and compensation.' },
    { icon: <Search size={28} />, title: 'Sourcing & Outreach', desc: 'Our recruitment team leverages global networks, specialized communities, and direct sourcing to find top talent.' },
    { icon: <ShieldCheck size={28} />, title: 'Curated Vetting', desc: 'We conduct rigorous technical assessments, behavioral interviews, and reference checks to ensure top quality.' },
    { icon: <Briefcase size={28} />, title: 'Offer & Onboarding', desc: 'We help coordinate the offer process and facilitate a seamless onboarding experience across different time zones.' },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-4">How We Hire</h1>
          <p className="text-slate-600 text-base md:text-lg">A refined, proven four-step methodology that guarantees you only meet the top 1% of global talent.</p>
        </div>

        {/* Timeline Layout: Stacks on Mobile, Line on Desktop */}
        <div className="relative md:border-l-2 md:border-slate-200 md:ml-6 md:pl-12 space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              
              {/* Yellow Circle Icon: Centered on Mobile, Absolute on Desktop */}
              <div className="flex md:block justify-center mb-4 md:mb-0 md:absolute md:-left-[58px] md:top-0">
                <div className="w-12 h-12 rounded-full bg-[#fffbeb] border-2 border-[#f59e0b] flex items-center justify-center text-[#f59e0b]">
                  {step.icon}
                </div>
              </div>

              {/* Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm text-center md:text-left">
                <div className="text-[#f59e0b] text-xs font-bold tracking-wider mb-2">
                  STEP {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}