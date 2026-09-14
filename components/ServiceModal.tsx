'use client'
import { X } from 'lucide-react'

export default function ServiceModal({ service, onClose }: { service: any, onClose: () => void }) {
  if (!service) return null

  return (
    // Dark Overlay
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      
      {/* White Modal Box */}
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
          {service.icon}
        </div>

        {/* Title & Detailed Description */}
        <h3 className="text-2xl font-bold text-[#0f172a] mb-4">{service.title}</h3>
        <p className="text-slate-600 leading-relaxed mb-6">{service.fullDesc}</p>

        {/* Close button at bottom for mobile users */}
        <button 
          onClick={onClose}
          className="w-full md:hidden bg-black text-white py-3 rounded-full font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  )
}