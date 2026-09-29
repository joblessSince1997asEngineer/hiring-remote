import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { invoiceId } = await request.json()
    if (!invoiceId) return NextResponse.json({ error: 'Missing invoiceId' }, { status: 400 })

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { application: { include: { job: true } } },
    })
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

    // Ownership check: client owns the job the invoice belongs to
    if (invoice.clientId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (invoice.status !== 'pending') {
      return NextResponse.json({ error: 'Invoice is not pending' }, { status: 400 })
    }

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { paymentNotifiedAt: new Date() },
    })

    // Notify admins
    const admins = await prisma.roles.findMany({ where: { role: 'admin' } })
    const jobTitle = invoice.application?.job?.title || 'a hire'
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.user_id,
          type: 'payment_sent',
          title: 'Client reports payment sent',
          message: `${invoice.invoiceNumber} ($${invoice.amount.toLocaleString()}) for "${jobTitle}" — client says payment was sent. Verify in your account.`,
          link: '/dashboard/invoices?status=pending',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('notify-payment-sent error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}