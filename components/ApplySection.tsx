'use client'

import { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import LongApplicationForm from '@/components/LongApplicationForm'

export default function ApplySection({ jobId }: { jobId: string }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="border-t border-slate-200 pt-8 mt-8">
            {!showForm ? (
        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-colors"
          >
            Apply for this role
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Application Form</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
          <LongApplicationForm jobId={jobId} />
        </div>
      )}
    </div>
  )
}