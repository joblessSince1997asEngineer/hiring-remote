'use client'
import { useActionState } from 'react'
import { postJob } from '@/app/actions'

export function PostJobForm() {
  const [state, action, pending] = useActionState(postJob, null)
  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="title" placeholder="Job Title" required className="w-full p-3 border border-slate-300 rounded-lg focus:border-yellow-400 outline-none" />
        <input name="company" placeholder="Company Name" required className="w-full p-3 border border-slate-300 rounded-lg focus:border-yellow-400 outline-none" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="location" placeholder="Location" required className="w-full p-3 border border-slate-300 rounded-lg focus:border-yellow-400 outline-none" />
        <select name="type" className="w-full p-3 border border-slate-300 rounded-lg focus:border-yellow-400 outline-none bg-white">
          <option>Full-time</option>
          <option>Contract</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="salaryMin" type="number" placeholder="Min Salary (k)" className="w-full p-3 border border-slate-300 rounded-lg focus:border-yellow-400 outline-none" />
        <input name="salaryMax" type="number" placeholder="Max Salary (k)" className="w-full p-3 border border-slate-300 rounded-lg focus:border-yellow-400 outline-none" />
      </div>
      <textarea name="description" placeholder="Job Description" required className="w-full p-3 border border-slate-300 rounded-lg focus:border-yellow-400 outline-none h-32 resize-none" />
      <button type="submit" disabled={pending} className="w-full bg-slate-900 text-white py-4 rounded-full font-bold hover:bg-slate-800 transition">
        {pending ? 'Posting...' : 'Publish Job'}
      </button>
    </form>
  )
}