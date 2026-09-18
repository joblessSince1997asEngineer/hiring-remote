import { getUserId } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ClientRequestsView from '@/components/ClientRequestsView'

export default async function ClientRequestsPage() {
  const cookieStore = await cookies()
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || role.role !== 'admin') redirect('/dashboard')

  const requests = await prisma.client_Requests.findMany({
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Client Requests</h1>
        <p className="text-slate-500">Incoming B2B hiring requests from companies.</p>
      </div>

      <ClientRequestsView requests={JSON.parse(JSON.stringify(requests))} />
    </div>
  )
}