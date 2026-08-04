'use client'
import { useActionState } from 'react'
import { postJob } from '@/app/actions'

export function PostJobForm() {
  // Wrapper to match React 19's useActionState signature: (prevState, formData)
  const postJobWithState = async (_prevState: any, formData: FormData) => {
    return postJob(formData)
  }

  const [state, action, pending] = useActionState(postJobWithState, null)

  return (
    <form action={action} className="space-y-4">
      <input name="title" placeholder="Job Title" required className="w-full p-3 border rounded-lg" />
      <input name="company" placeholder="Company Name" required className="w-full p-3 border rounded-lg" />
      <input name="location" placeholder="Location" required className="w-full p-3 border rounded-lg" />
      <select name="type" className="w-full p-3 border rounded-lg">
        <option>Full-time</option>
        <option>Contract</option>
      </select>
      <div className="flex gap-4">
        <input name="salaryMin" type="number" placeholder="Min Salary (k)" className="w-full p-3 border rounded-lg" />
        <input name="salaryMax" type="number" placeholder="Max Salary (k)" className="w-full p-3 border rounded-lg" />
      </div>
      <textarea name="description" placeholder="Job Description" required className="w-full p-3 border rounded-lg h-32" />
      <button disabled={pending} className="w-full bg-black text-white py-3 rounded-full font-semibold">
        {pending ? 'Posting...' : 'Publish Job'}
      </button>
    </form>
  )
}