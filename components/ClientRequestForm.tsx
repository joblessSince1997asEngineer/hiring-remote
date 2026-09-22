'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, User, Briefcase, DollarSign, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react'

export default function ClientRequestForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const [formData, setFormData] = useState({
    // Step 1: Company
    company_name: '',
    companyWebsite: '',
    companySize: '',
    contactName: '',
    contact_email: '',

    // Step 2: Role
    role_title: '',
    seniority: '',
    remoteType: '',
    location: '',
    tech_stack: [] as string[],

    // Step 3: Budget & Timeline
    budget_min: '',
    budget_max: '',
    currency: 'USD',
    budgetPeriod: 'month',
    working_hours: '',
    urgency: '',
    requirements: '',
  })

  const update = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }))

  const inputClass = 'w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm bg-white'
  const labelClass = 'block text-sm font-semibold text-slate-700 mb-1'

  const nextStep = () => setStep(s => Math.min(4, s + 1))
  const prevStep = () => setStep(s => Math.max(1, s - 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      toast.error('Please confirm the declaration before submitting.')
      return
    }
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
        toast.success('Hiring request submitted! Admin will review it shortly.')
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

  // Step indicator
  const steps = [
    { n: 1, label: 'Company', icon: Building2 },
    { n: 2, label: 'Role', icon: Briefcase },
    { n: 3, label: 'Budget', icon: DollarSign },
    { n: 4, label: 'Review', icon: CheckCircle2 },
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
                              <h1 className="text-2xl font-bold mb-6 text-slate-900">Start Hiring</h1>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, idx) => {
          const Icon = s.icon
          const active = step === s.n
          const done = step > s.n
          return (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  done ? 'bg-green-500 text-white' :
                  active ? 'bg-black text-white' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${done ? 'bg-green-500' : 'bg-slate-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Step 1: Company */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide pb-2 border-b-2 border-yellow-400 inline-block">
              About Your Company
            </h2>

            <div>
              <label className={labelClass}>Company Name *</label>
              <input type="text" required value={formData.company_name}
                onChange={(e) => update('company_name', e.target.value)}
                placeholder="Acme Inc." className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Company Website</label>
              <input type="url" value={formData.companyWebsite}
                onChange={(e) => update('companyWebsite', e.target.value)}
                placeholder="https://acme.com" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Company Size *</label>
              <select required value={formData.companySize}
                onChange={(e) => update('companySize', e.target.value)} className={inputClass}>
                <option value="">Select size</option>
                <option value="1-10">1–10 employees</option>
                <option value="11-50">11–50 employees</option>
                <option value="51-200">51–200 employees</option>
                <option value="201-500">201–500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Your Name *</label>
              <input type="text" required value={formData.contactName}
                onChange={(e) => update('contactName', e.target.value)}
                placeholder="John Doe" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Work Email *</label>
              <input type="email" required value={formData.contact_email}
                onChange={(e) => update('contact_email', e.target.value)}
                placeholder="john@acme.com" className={inputClass} />
            </div>

            <button type="button" onClick={nextStep}
              className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-slate-800 flex items-center justify-center gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Role */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide pb-2 border-b-2 border-yellow-400 inline-block">
              The Role
            </h2>

            <div>
              <label className={labelClass}>Role Title *</label>
              <input type="text" required value={formData.role_title}
                onChange={(e) => update('role_title', e.target.value)}
                placeholder="Senior React Developer" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Seniority Level *</label>
              <select required value={formData.seniority}
                onChange={(e) => update('seniority', e.target.value)} className={inputClass}>
                <option value="">Select level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead / Principal</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Work Mode *</label>
              <select required value={formData.remoteType}
                onChange={(e) => update('remoteType', e.target.value)} className={inputClass}>
                <option value="">Select mode</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Location *</label>
              <input type="text" required value={formData.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="Remote, or City, Country" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Tech Stack / Skills *</label>
              <input type="text" required value={formData.tech_stack.join(', ')}
                onChange={(e) => update('tech_stack', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="e.g. React, TypeScript, Node.js" className={inputClass} />
              <p className="text-xs text-slate-400 mt-1">Comma separated — used for candidate matching</p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={prevStep}
                className="flex-1 border border-slate-300 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-slate-50">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="button" onClick={nextStep}
                className="flex-1 bg-black text-white py-3 rounded-full font-semibold hover:bg-slate-800 flex items-center justify-center gap-2">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Budget & Timeline */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide pb-2 border-b-2 border-yellow-400 inline-block">
              Budget & Timeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Currency</label>
                <select value={formData.currency}
                  onChange={(e) => update('currency', e.target.value)} className={inputClass}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="PKR">PKR (₨)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Period</label>
                <select value={formData.budgetPeriod}
                  onChange={(e) => update('budgetPeriod', e.target.value)} className={inputClass}>
                  <option value="month">Per Month</option>
                  <option value="year">Per Year</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Urgency</label>
                <select value={formData.urgency}
                  onChange={(e) => update('urgency', e.target.value)} className={inputClass}>
                  <option value="">Select</option>
                  <option value="asap">ASAP</option>
                  <option value="2weeks">Within 2 weeks</option>
                  <option value="1month">Within 1 month</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Budget Min *</label>
                <input type="number" required value={formData.budget_min}
                  onChange={(e) => update('budget_min', e.target.value)}
                  placeholder="3000" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Budget Max *</label>
                <input type="number" required value={formData.budget_max}
                  onChange={(e) => update('budget_max', e.target.value)}
                  placeholder="6000" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Working Hours *</label>
              <input type="text" required value={formData.working_hours}
                onChange={(e) => update('working_hours', e.target.value)}
                placeholder="e.g. 9am–5pm EST, or flexible" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Additional Requirements</label>
              <textarea rows={3} value={formData.requirements}
                onChange={(e) => update('requirements', e.target.value)}
                placeholder="Any specific certifications, tools, time zone overlap, etc."
                className={inputClass + ' resize-none'} />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={prevStep}
                className="flex-1 border border-slate-300 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-slate-50">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="button" onClick={nextStep}
                className="flex-1 bg-black text-white py-3 rounded-full font-semibold hover:bg-slate-800 flex items-center justify-center gap-2">
                Review <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide pb-2 border-b-2 border-yellow-400 inline-block">
              Review & Submit
            </h2>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase">Company</p>
                <p className="font-medium text-slate-800">{formData.company_name} {formData.companySize && `• ${formData.companySize}`}</p>
                <p className="text-slate-600 text-xs">{formData.contactName} • {formData.contact_email}</p>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-400 uppercase">Role</p>
                <p className="font-medium text-slate-800">{formData.role_title}</p>
                <p className="text-slate-600 text-xs">
                  {formData.seniority} • {formData.remoteType} • {formData.location}
                </p>
                {formData.tech_stack.length > 0 && (
                  <p className="text-slate-600 text-xs mt-1">Skills: {formData.tech_stack.join(', ')}</p>
                )}
              </div>
              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-400 uppercase">Budget</p>
                <p className="font-medium text-slate-800">
                  {formData.currency} {formData.budget_min}–{formData.budget_max} / {formData.budgetPeriod}
                </p>
                <p className="text-slate-600 text-xs">
                  Hours: {formData.working_hours}
                  {formData.urgency && ` • Urgency: ${formData.urgency}`}
                </p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4" />
              <span className="text-sm text-slate-700">
                I confirm this is a genuine hiring request and consent to Remote Hirring reviewing and posting this role on my behalf.
              </span>
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={prevStep}
                className="flex-1 border border-slate-300 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-slate-50">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" disabled={loading || !agreed}
                className="flex-1 bg-black text-white py-3 rounded-full font-bold hover:bg-slate-800 disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  )
}