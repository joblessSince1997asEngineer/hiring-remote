'use client'
import { useActionState } from 'react'
import { applyToJob } from '@/app/actions'

export function ApplyForm({ jobId }: { jobId: string }) {
  // This wrapper matches the signature expected by useActionState
  const applyWithJob = async (_prevState: any, formData: FormData) => {
    return applyToJob(jobId, formData)
  }

  const [state, action, pending] = useActionState(applyWithJob, null)

  return (
    <form action={action}>
      <textarea 
        name="coverLetter" 
        placeholder="Cover letter..." 
        required 
      />
      <button disabled={pending}>
        {pending ? 'Applying...' : 'Apply Now'}
      </button>
    </form>
  )
}