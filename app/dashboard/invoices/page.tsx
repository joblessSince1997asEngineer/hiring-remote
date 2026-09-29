export const dynamic = 'force-dynamic'
import { getUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import InvoiceRowActions from '@/components/InvoiceRowActions'

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  paid:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
}

type Status = 'all' | 'pending' | 'paid' | 'cancelled'

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const userId = await getUserId()
  if (!userId) redirect('/login')

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRow) redirect('/login')
  const isAdmin = roleRow.role === 'admin' || roleRow.role === 'super_admin'

  const { status: statusParam } = await searchParams
  const status: Status = (['pending', 'paid', 'cancelled'] as const).includes(
    statusParam as any
  )
    ? (statusParam as Status)
    : 'all'

  let scopeFilter: any = {}
  if (!isAdmin) {
    const myJobs = await prisma.job.findMany({
      where: { recruiterId: userId },
      select: { id: true },
    })
    scopeFilter = {
      application: { jobId: { in: myJobs.map(j => j.id) } },
    }
  }

  const where: any = { ...scopeFilter }
  if (status !== 'all') where.status = status

  const invoices = await prisma.invoice.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { application: { include: { job: true } } },
  })

  let clientMap = new Map<string, string>()
  if (isAdmin && invoices.length) {
    const ids = [...new Set(invoices.map(i => i.clientId).filter(Boolean) as string[])]
    const clients = await prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, email: true },
    })
    clientMap = new Map(clients.map(c => [c.id, c.email]))
  }

  const grouped = await prisma.invoice.groupBy({
    by: ['status'],
    where: scopeFilter,
    _count: { _all: true },
  })
  const countMap: Record<string, number> = Object.fromEntries(
    grouped.map(g => [g.status, g._count._all])
  )
  const total = Object.values(countMap).reduce((s, n) => s + n, 0)

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Invoices</h1>
        <p className="text-slate-500">
          {isAdmin
            ? 'All client invoices across the platform.'
            : 'Your hire invoices and payment status.'}
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'pending', 'paid', 'cancelled'] as const).map(s => {
          const active = status === s
          const label = s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)
          const count = s === 'all' ? total : (countMap[s] ?? 0)
          const href =
            s === 'all' ? '/dashboard/invoices' : `/dashboard/invoices?status=${s}`
          return (
            <Link
              key={s}
              href={href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors no-underline ${
                active
                  ? 'bg-[#0f172a] text-white border-[#0f172a]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              {label}{' '}
              <span className={active ? 'text-slate-300' : 'text-slate-400'}>
                ({count})
              </span>
            </Link>
          )
        })}
      </div>

      {invoices.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center bg-white">
          <p className="text-slate-500">
            No invoices
            {status !== 'all' ? ` with status "${status}"` : ''} yet.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Horizontal scroll wrapper for mobile */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="text-left px-5 py-3 font-medium whitespace-nowrap">Invoice #</th>
                  <th className="text-left px-5 py-3 font-medium whitespace-nowrap">Date</th>
                  {isAdmin && (
                    <th className="text-left px-5 py-3 font-medium whitespace-nowrap">Client</th>
                  )}
                  <th className="text-left px-5 py-3 font-medium whitespace-nowrap">Job</th>
                  <th className="text-right px-5 py-3 font-medium whitespace-nowrap">Amount</th>
                  <th className="text-left px-5 py-3 font-medium whitespace-nowrap">Due</th>
                  <th className="text-left px-5 py-3 font-medium whitespace-nowrap">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map(inv => {
                  const style =
                    STATUS_STYLES[inv.status] ?? STATUS_STYLES.cancelled
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 font-mono text-slate-800 whitespace-nowrap">
                        {inv.invoiceNumber ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                          {clientMap.get(inv.clientId) ??
                            inv.clientId.slice(0, 8)}
                        </td>
                      )}
                      <td className="px-5 py-3 text-slate-800 whitespace-nowrap">
                        {inv.application?.job?.title ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-[#0f172a] whitespace-nowrap">
                        ${inv.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(inv.dueAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${style}`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {isAdmin && (
                            <InvoiceRowActions
                              invoice={{
                                id: inv.id,
                                invoiceNumber: inv.invoiceNumber ?? '—',
                                amount: inv.amount,
                                clientEmail:
                                  clientMap.get(inv.clientId) ??
                                  inv.clientId.slice(0, 8),
                                status: inv.status,
                                paymentNotifiedAt:
                                  inv.paymentNotifiedAt?.toISOString() ?? null,
                              }}
                            />
                          )}
                          <Link
                            href={`/invoice?id=${inv.id}`}
                            className="text-blue-600 hover:underline text-xs font-medium no-underline whitespace-nowrap"
                          >
                            View →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}