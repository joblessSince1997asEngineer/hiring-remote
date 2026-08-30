'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientRequestForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    company_name: '', contact_email: '', role_title: '', tech_stack: [], budget_min: '', budget_max: '', working_hours: ''
  })

  const update = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/client-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        alert('Hiring request submitted successfully! Admin will review it.')
        router.push('/')
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Submit Hiring Request</h1>
      <p className="text-sm text-slate-500 mb-6">Step {step} of 3</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <input type="text" placeholder="Company Name" required value={formData.company_name} onChange={(e) => update('company_name', e.target.value)} className="w-full p-3 border rounded-lg" />
            <input type="email" placeholder="Contact Email" required value={formData.contact_email} onChange={(e) => update('contact_email', e.target.value)} className="w-full p-3 border rounded-lg" />
            <button type="button" onClick={() => setStep(2)} className="w-full bg-black text-white py-3 rounded-full">Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input type="text" placeholder="Role Title" required value={formData.role_title} onChange={(e) => update('role_title', e.target.value)} className="w-full p-3 border rounded-lg" />
            <input type="text" placeholder="Tech Stack (comma separated)" required value={formData.tech_stack.join(', ')} onChange={(e) => update('tech_stack', e.target.value.split(',').map((s: string) => s.trim()))} className="w-full p-3 border rounded-lg" />
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} className="flex-1 border border-slate-300 py-3 rounded-full">Back</button>
              <button type="button" onClick={() => setStep(3)} className="flex-1 bg-black text-white py-3 rounded-full">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Budget Min ($)" required value={formData.budget_min} onChange={(e) => update('budget_min', e.target.value)} className="w-full p-3 border rounded-lg" />
              <input type="number" placeholder="Budget Max ($)" required value={formData.budget_max} onChange={(e) => update('budget_max', e.target.value)} className="w-full p-3 border rounded-lg" />
            </div>
            <input type="text" placeholder="Working Hours (e.g. 9am-5pm EST)" required value={formData.working_hours} onChange={(e) => update('working_hours', e.target.value)} className="w-full p-3 border rounded-lg" />
            
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(2)} className="flex-1 border border-slate-300 py-3 rounded-full">Back</button>
              <button type="submit" disabled={loading} className="flex-1 bg-black text-white py-3 rounded-full font-bold">
                {loading ? 'Submitting...' : 'Submit Hiring Request'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}