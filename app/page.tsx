import Link from 'next/link'
import { Search, ShieldCheck, Calendar } from 'lucide-react'

export default function HomePage() {
  const services = [
    { 
      icon: <Search size={28} color="#2563eb" />, 
      title: 'Candidate Sourcing', 
      desc: 'We leverage deep networks, proprietary databases, and targeted outreach to find passive talent for your roles.',
      link: '/services#candidate-sourcing'
    },
    { 
      icon: <ShieldCheck size={28} color="#2563eb" />, 
      title: 'Candidate Screening', 
      desc: 'Our rigorous multi-stage screening process includes technical assessments, behavioral interviews, and reference checks.',
      link: '/services#candidate-screening'
    },
    { 
      icon: <Calendar size={28} color="#2563eb" />, 
      title: 'Interview Coordination', 
      desc: 'We handle all scheduling logistics across time zones, ensuring a smooth and professional experience.',
      link: '/services#interview-coordination'
    },
  ]

  const team = [
    { 
      name: 'Adnan Riaz', 
      role: 'Founder', 
      img: '/riaz.png', 
      summary: 'Founder with a background in Finance, Operations, and HR. Passionate about Accounting and building the company.' 
    },
    { 
      name: 'Mubashir Ali', 
      role: 'Chief Of Executive', 
      img: '/mubashir.png', 
      summary: 'CEO blending technical expertise with strategic business leadership to scale RemoteHirring globally.' 
    },
    { 
      name: 'Ulishba Arif Malik', 
      role: 'Recruitment Specialist', 
      img: '/ulishba.png', 
      summary: 'Knows the methodology to recruit, effectively sourcing and placing top-tier talent for our clients.' 
    },
  ]

  const pricing = [
    { title: 'Junior Roles', rate: '15%' },
    { title: 'Mid-Level Roles', rate: '25%' },
    { title: 'Senior Roles', rate: '40%' },
  ]

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white flex flex-col items-center px-4 sm:px-6 py-12 md:py-16 text-center">
      
      <div className="inline-block bg-white/10 border border-white/20 text-slate-100 px-3 py-1.5 rounded-full text-[11px] md:text-xs font-semibold tracking-wider mb-5">
        GLOBAL REACH • ELITE TALENT
      </div>

      <h1 className="text-3xl md:text-6xl font-extrabold leading-tight mb-5">
        Hire Top Remote <br className="hidden sm:block" />
        <span className="text-blue-500">Talent Worldwide.</span>
      </h1>

      <p className="text-slate-200 text-base md:text-lg max-w-xl leading-relaxed mb-8">
        Empowering startups and enterprises to build high-performing distributed teams. We source, screen, and vet the world's top 1% of remote professionals for you.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center mb-12 md:mb-16">
        <Link href="/dashboard/post" className="w-full sm:w-auto">
          <button className="w-full bg-black text-white border-2 border-black py-3 px-8 rounded-full font-semibold text-sm md:text-base">Hire Talent</button>
        </Link>
        <Link href="/jobs" className="w-full sm:w-auto">
          <button className="w-full bg-transparent text-white border border-slate-600 py-3 px-8 rounded-full font-semibold text-sm md:text-base">Browse Jobs</button>
        </Link>
      </div>

      {/* Row 1: Our Core Services */}
      <div className="w-full max-w-6xl mx-auto mb-12 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 text-white">Our Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {services.map((service, index) => (
            <div key={index} className="bg-[#1e293b] rounded-2xl p-6 shadow-lg border border-slate-700/50">
              <div className="w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-slate-200 text-sm leading-relaxed mb-4">{service.desc}</p>
              <Link href={service.link} className="inline-flex items-center gap-1 text-sm font-medium text-[#2563eb] hover:text-blue-400 transition-colors">
                Learn More →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Our Team */}
      <div className="w-full max-w-6xl mx-auto mb-12 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 text-white">Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {team.map((member, index) => (
            <div key={index} className="bg-[#1e293b] rounded-2xl p-6 shadow-lg border border-slate-700/50">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-slate-200">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-[#2563eb] text-sm font-medium mb-3">{member.role}</p>
              <p className="text-slate-200 text-sm leading-relaxed mb-4">{member.summary}</p>
              <Link href="/team" className="inline-flex items-center gap-1 text-sm font-medium text-[#2563eb] hover:text-blue-400 transition-colors">
                Learn More →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Our Pricing */}
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 text-white">Our Pricing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Pricing Card 1 */}
          <div className="bg-[#1e293b] rounded-2xl p-6 shadow-lg border border-slate-700/50">
            <div className="font-bold text-white mb-4 text-lg">One-Time Placement Fee</div>
            {pricing.map((item, index) => (
              <div key={index} className="flex justify-between border-b border-slate-700 pb-3 mb-3 last:border-b-0">
                <span className="text-white">{item.title}</span>
                <span className="text-[#2563eb] font-bold">{item.rate}</span>
              </div>
            ))}
          </div>

          {/* Pricing Card 2 */}
          <div className="bg-[#1e293b] rounded-2xl p-6 shadow-lg border border-slate-700/50">
            <div className="font-bold text-white mb-4 text-lg">Flat Fee Per Hire</div>
            <div className="flex justify-between border-b border-slate-700 pb-3 mb-3">
              <span className="text-white">Entry-Level</span>
              <span className="text-white font-semibold">$300</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-3 mb-3">
              <span className="text-white">Mid-Level</span>
              <span className="text-white font-semibold">$500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Senior</span>
              <span className="text-white font-semibold">$1,000</span>
            </div>
          </div>

          {/* Pricing Card 3 */}
          <div className="bg-[#1e293b] rounded-2xl p-6 shadow-lg border border-slate-700/50">
            <div className="font-bold text-white mb-4 text-lg">Monthly Subscription</div>
            <div className="flex justify-between border-b border-slate-700 pb-3 mb-3">
              <span className="text-white">Starter</span>
              <span className="text-[#2563eb] font-semibold">3 hires/month</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-3 mb-3">
              <span className="text-white">Growth</span>
              <span className="text-[#2563eb] font-semibold">10 hires/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Enterprise</span>
              <span className="text-[#2563eb] font-semibold">Unlimited</span>
            </div>
            <Link href="/pricing" className="inline-flex items-center gap-1 text-sm font-medium text-[#2563eb] hover:text-blue-400 transition-colors mt-4">
              View Full Pricing →
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}