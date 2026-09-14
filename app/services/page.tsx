'use client'
import { useState } from 'react'
import { Search, ShieldCheck, Calendar } from 'lucide-react'
import ServiceModal from '@/components/ServiceModal'

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<any>(null)

  const services = [
    { 
      icon: <Search size={32} color="#0f172a" />, 
      title: 'Candidate Sourcing', 
      desc: 'We leverage deep networks, proprietary databases, and targeted outreach to find passive talent that perfectly matches your requirements.',
      fullDesc: 'Our sourcing process goes far beyond posting a job ad. We use deep industry networks, proprietary database searches, and targeted outreach to uncover passive talent who aren\'t actively looking but are the perfect fit. Our recruiters use Boolean search, talent mapping, and market intelligence to build a tailored shortlist of candidates who match not just the technical requirements, but also your company\'s culture and long-term goals.'
    },
    { 
      icon: <ShieldCheck size={32} color="#0f172a" />, 
      title: 'Candidate Screening', 
      desc: 'Our rigorous multi-stage screening process includes technical assessments, behavioral interviews, and reference checks.',
      fullDesc: 'Our rigorous multi-stage screening process is designed to leave no stone unturned. We begin with a technical skills assessment to validate core competencies, followed by an in-depth behavioral interview to assess cultural fit, soft skills, and communication style. Finally, we conduct thorough reference checks and background verifications to ensure every candidate is as professional and reliable on paper as they are in the interview.'
    },
    { 
      icon: <Calendar size={32} color="#0f172a" />, 
      title: 'Interview Coordination', 
      desc: 'We handle all scheduling logistics across time zones, ensuring a smooth and professional experience for both you and the candidate.',
      fullDesc: 'Once we identify the top candidates, we handle every logistical detail to ensure a seamless experience. Our team manages all scheduling across multiple time zones, coordinates video call links, and provides both sides with precise timing and agendas. We act as the middleman to ensure that no interview is missed, no time is wasted, and the entire process feels professional and effortless for both you and the candidate.'
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-4">Our Services</h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">Comprehensive remote recruitment solutions designed to help you build elite global teams quickly and efficiently.</p>
        </div>

        {/* Services Grid: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">{service.title}</h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">{service.desc}</p>
              
              {/* Clicking this opens the modal */}
              <button 
                onClick={() => setSelectedService(service)}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#0f172a] hover:text-blue-600 transition-colors"
              >
                Learn more →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* The Popup Modal */}
      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
    </div>
  )
}