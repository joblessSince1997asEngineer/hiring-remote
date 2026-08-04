'use client'
import { useActionState } from 'react'
import { applyToJob } from '@/app/actions'

export function ApplyForm({ jobId }: { jobId: string }) {
  const boundAction = applyToJob.bind(null, jobId)
  const [state, action, pending] = useActionState(boundAction, null)
  return <form action={action}><textarea name="coverLetter" placeholder="Cover letter..." required /><button disabled={pending}>{pending?'Applying...':'Apply Now'}</button></form>
}