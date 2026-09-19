'use client'

import { useActionState } from 'react'
import { postJob } from '@/app/actions'

export function PostJobForm({ clients }: { clients: { id: string; email: string }[] }) {
  const [state, action, pending] = useActionState(postJob, null)

  const inputClass = 'w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm bg-white'
  const labelClass = 'block text-sm font-semibold text-slate-700 mb-1'

  return (
    <form action={action} className="space-y-6">

      {/* Section 0: Ownership */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 pb-2 border-b-2 border-yellow-400 inline-block">
          Job Ownership
        </h2>
        <div>
          <label className={labelClass}>This job belongs to *</label>
          <select name="ownerId" required className={inputClass} defaultValue="">
            <option value="">Select a client...</option>
            <option value="__internal__">Internal (Remote Hirring — no client)</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.email}</option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1">
            Choose a client so they see this job + pay the placement fee. Pick "Internal" for admin-only jobs.
          </p>
        </div>
      </div>

      {/* Section 1: Basic Info */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 pb-2 border-b-2 border-yellow-400 inline-block">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Job Title *</label>
            <input name="title" placeholder="e.g. Senior React Developer" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Company *</label>
            <input name="company" placeholder="Company name" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Department / Category</label>
            <select name="category" className={inputClass}>
              <option value="">Select category</option>
              {['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'Human Resources', 'Customer Support', 'Data & Analytics', 'Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Seniority Level *</label>
            <select name="seniority" required className={inputClass}>
              <option value="">Select level</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead / Principal</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Employment Type *</label>
            <select name="type" required className={inputClass}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Location */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 pb-2 border-b-2 border-yellow-400 inline-block">
          Location & Work Mode
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Work Mode *</label>
            <select name="remoteType" required className={inputClass}>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Location *</label>
            <input name="location" placeholder="e.g. Remote, or New York, USA" required className={inputClass} />
          </div>
        </div>
      </div>

      {/* Section 3: Compensation */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 pb-2 border-b-2 border-yellow-400 inline-block">
          Compensation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Currency</label>
            <select name="currency" className={inputClass}>
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
            <select name="salaryPeriod" className={inputClass}>
              <option value="year">Per Year</option>
              <option value="month">Per Month</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Salary Min *</label>
            <input name="salaryMin" type="number" placeholder="e.g. 60000" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Salary Max *</label>
            <input name="salaryMax" type="number" placeholder="e.g. 90000" required className={inputClass} />
          </div>
        </div>
      </div>

      {/* Section 4: Description */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 pb-2 border-b-2 border-yellow-400 inline-block">
          Job Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Short Summary *</label>
            <textarea name="description" placeholder="A brief 2-3 line summary of the role..." required rows={3} className={inputClass + ' resize-none'} />
          </div>
          <div>
            <label className={labelClass}>Responsibilities</label>
            <textarea name="responsibilities" placeholder="What will this person do day-to-day? One per line." rows={4} className={inputClass + ' resize-none'} />
          </div>
          <div>
            <label className={labelClass}>Requirements</label>
            <textarea name="requirements" placeholder="Must-have skills, experience, qualifications. One per line." rows={4} className={inputClass + ' resize-none'} />
          </div>
          <div>
            <label className={labelClass}>Nice to Have</label>
            <textarea name="niceToHave" placeholder="Bonus skills, extra qualifications (optional)" rows={2} className={inputClass + ' resize-none'} />
          </div>
        </div>
      </div>

      {/* Section 5: Skills + Deadline */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 pb-2 border-b-2 border-yellow-400 inline-block">
          Skills & Timeline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Skills (comma separated)</label>
            <input name="skills" placeholder="e.g. React, TypeScript, Node.js" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Application Deadline</label>
            <input name="applicationDeadline" type="date" className={inputClass} />
          </div>
        </div>
      </div>

      {state && typeof state === 'object' && 'error' in state && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {String((state as any).error)}
        </div>
      )}

      <button type="submit" disabled={pending} className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-slate-800 disabled:opacity-60">
        {pending ? 'Publishing...' : 'Publish Job'}
      </button>
    </form>
  )
}