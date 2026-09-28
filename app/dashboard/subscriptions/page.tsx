export const dynamic = 'force-dynamic'
import { getUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SubscriptionsView from '@/components/SubscriptionsView'

export default async function SubscriptionsPage() {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRow) redirect('/login')
  const isAdmin = roleRow.role === 'admin' || roleRow.role === 'super_admin'
  if (!isAdmin) redirect('/dashboard')

  // All subscriptions + client email
  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const subUserIds = subscriptions.map(s => s.userId)
  const subUsers = await prisma.user.findMany({
    where: { id: { in: subUserIds } },
    select: { id: true, email: true },
  })
  const emailMap = new Map(subUsers.map(u => [u.id, u.email]))

  // Eligible clients: users with a 'recruiter' role and no subscription yet
  const recruiterRoles = await prisma.roles.findMany({
    where: { role: 'recruiter' },
    select: { user_id: true },
  })
  const recruiterIds = recruiterRoles.map(r => r.user_id)

  const alreadySubscribed = new Set(subUserIds)

  const eligibleUsers = await prisma.user.findMany({
    where: {
      id: { in: recruiterIds.filter(id => !alreadySubscribed.has(id)) },
    },
    select: { id: true, email: true },
    orderBy: { email: 'asc' },
  })

  const serialized = subscriptions.map(s => ({
    id: s.id,
    userId: s.userId,
    clientEmail: emailMap.get(s.userId) ?? s.userId.slice(0, 8),
    tier: s.tier,
    status: s.status,
    startedAt: s.startedAt.toISOString(),
    expiresAt: s.expiresAt.toISOString(),
    firstPaymentAmount: s.firstPaymentAmount,
    renewalAmount: s.renewalAmount,
    renewalReminderSentAt: s.renewalReminderSentAt?.toISOString() ?? null,
  }))

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Subscription Management</h1>
        <p className="text-slate-500">
          Activate, edit, or cancel client annual subscriptions. Discounts apply to
          new hire invoices only.
        </p>
      </div>

      <SubscriptionsView
        subscriptions={serialized}
        eligibleUsers={eligibleUsers}
      />
    </div>
  )
}