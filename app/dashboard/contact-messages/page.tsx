import { getUserId } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ContactMessagesView from '@/components/ContactMessagesView'

export default async function ContactMessagesPage() {
  const cookieStore = await cookies()
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRow || !['admin', 'super_admin'].includes(roleRow.role)) {
    redirect('/unauthorized')
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Contact Messages</h1>
        <p className="text-slate-500">Inquiries submitted through the contact form.</p>
      </div>

      <ContactMessagesView messages={JSON.parse(JSON.stringify(messages))} />
    </div>
  )
}