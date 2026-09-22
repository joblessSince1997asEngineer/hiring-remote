import { getUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ClientRequestForm from '@/components/ClientRequestForm'

export default async function RequestJobPage() {
  const userId = await getUserId()
  const roleRow = userId ? await prisma.roles.findUnique({ where: { user_id: userId } }) : null
  const role = roleRow?.role

  // Not logged in → push to signup with recruiter intent
  if (!userId) {
    redirect('/sign-up?intent=hiring')
  }

  // Candidate → can't submit hiring requests
  if (role === 'candidate') {
    redirect('/jobs')
  }

  // Client (recruiter) or admin → allowed
  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <ClientRequestForm />
    </div>
  )
}