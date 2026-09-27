import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const invoiceId = searchParams.get('id')
  const jobId = searchParams.get('jobId')

  // New flow: fetch by invoice id
  if (invoiceId) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        application: {
          include: { job: true },
        },
      },
    })

    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

    // Only the client who owns this invoice (or an admin) can view it
    const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
    const isAdmin = roleRow?.role === 'admin' || roleRow?.role === 'super_admin'
    if (invoice.clientId !== userId && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ invoice })
  }

  // Legacy: fetch by jobId (keep for backward compatibility)
  if (jobId) {
    const application = await prisma.application.findFirst({
      where: { jobId, status: 'hired' },
      orderBy: { appliedAt: 'desc' },
    })
    if (!application) return NextResponse.json({ error: 'No hired candidate found' }, { status: 404 })
    const job = await prisma.job.findUnique({ where: { id: jobId } })
    return NextResponse.json({ application, job })
  }

  return NextResponse.json({ error: 'Missing id or jobId' }, { status: 400 })
}