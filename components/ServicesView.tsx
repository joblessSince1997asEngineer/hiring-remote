'use client'
import { useState } from 'react'
import { Search, ShieldCheck, Calendar } from 'lucide-react'
import ServiceModal from '@/components/ServiceModal'

export type ServiceItem = {
  icon: React.ReactNode
  title: string
  desc: string
  fullDesc: string
}

export default function ServicesView({
  headerTitle,
  headerSubtitle,
  services,
}: {
  headerTitle: string
  headerSubtitle: string
  services: ServiceItem[]
}) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-4">
            {headerTitle}
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
            {headerSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">{service.title}</h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                {service.desc}
              </p>
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

      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
    </div>
  )
}