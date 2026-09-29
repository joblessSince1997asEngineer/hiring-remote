import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email-send'

async function requireAdmin() {
  const userId = await getUserId()
  if (!userId) return null
  const row = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!row) return null
  if (row.role !== 'admin' && row.role !== 'super_admin') return null
  return userId
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const { invoiceId, paymentMethod, paymentReference } = await request.json()
    if (!invoiceId) return NextResponse.json({ error: 'Missing invoiceId' }, { status: 400 })

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { application: { include: { job: true } } },
    })
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    if (invoice.status === 'paid') {
      return NextResponse.json({ error: 'Already paid' }, { status: 400 })
    }

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'paid',
        paidAt: new Date(),
        terminatedAt: null,
        paymentMethod: paymentMethod || 'other',
        paymentReference: paymentReference || null,
      },
    })

    // Notify client
    await prisma.notification.create({
      data: {
        userId: invoice.clientId,
        type: 'invoice_paid',
        title: 'Payment received',
        message: `${invoice.invoiceNumber} has been marked as paid. Thank you!`,
        link: `/invoice?id=${invoice.id}`,
      },
    })

    // Email client
    const client = await prisma.user.findUnique({ where: { id: invoice.clientId } })
    if (client?.email) {
      try {
        await sendEmail({
          to: client.email,
          subject: `Payment received — ${invoice.invoiceNumber}`,
          title: 'Payment Received',
          greeting: 'Hi,',
          body: `
            <p>We've received your payment. Your invoice has been marked as paid.</p>
            <p>Thank you for using Remote Hirring.</p>
          `,
          infoRows: [
            { label: 'Invoice #', value: invoice.invoiceNumber },
            { label: 'Amount', value: `$${invoice.amount.toLocaleString()}`, highlight: true },
            { label: 'Method', value: (paymentMethod || 'other').replace('_', ' ') },
            { label: 'Reference', value: paymentReference || '—' },
          ],
        })
      } catch (emailErr) {
        console.error('Confirmation email failed (non-fatal):', emailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('mark-paid error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}