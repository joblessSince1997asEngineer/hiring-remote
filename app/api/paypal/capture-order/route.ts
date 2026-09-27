import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { capturePayPalOrder } from '@/lib/paypal'
import { sendEmail } from '@/lib/email-send'

export async function POST(request: Request) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { orderId, invoiceId } = await request.json()
    if (!orderId || !invoiceId) {
      return NextResponse.json({ error: 'Missing orderId or invoiceId' }, { status: 400 })
    }

    // Load invoice + verify ownership
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    })
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    if (invoice.clientId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (invoice.status === 'paid') {
      return NextResponse.json({ success: true, alreadyPaid: true })
    }

    // Capture payment via PayPal
    const capture = await capturePayPalOrder(orderId)

    // Verify capture succeeded
    const status = capture?.status
    if (status !== 'COMPLETED') {
      return NextResponse.json(
        { error: `Payment not completed. Status: ${status}` },
        { status: 400 }
      )
    }

    // Payment succeeded — update DB in one transaction
    const [updatedInvoice, updatedApplication] = await prisma.$transaction([
      prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: 'paid',
          paidAt: new Date(),
          stripePaymentIntentId: capture?.purchase_units?.[0]?.payments?.captures?.[0]?.id || null,
        },
      }),
      prisma.application.update({
        where: { id: invoice.applicationId },
        data: { status: 'hired' },
      }),
    ])

    // Send confirmation emails
    try {
      // Email to client (payer)
      const client = await prisma.user.findUnique({ where: { id: invoice.clientId } })
      if (client?.email) {
        await sendEmail({
          to: client.email,
          subject: 'Payment confirmed — Remote Hirring',
          title: 'Payment Received',
          greeting: 'Hi,',
          body: `Thank you! We've received your payment. Your hire is now confirmed.`,
          infoRows: [
            { label: 'Invoice', value: `#${invoice.id.slice(-6)}` },
            { label: 'Amount Paid', value: `$${invoice.amount.toLocaleString()}`, highlight: true },
            { label: 'Payment Date', value: new Date().toLocaleDateString() },
          ],
        })
      }

      // Email to admin
      await sendEmail({
        to: 'hr@remotehirring.com',
        subject: `Payment received — Invoice #${invoice.id.slice(-6)}`,
        title: 'Payment Received',
        greeting: 'Hi team,',
        body: `A client has paid their invoice. The hire is now confirmed.`,
        infoRows: [
          { label: 'Invoice', value: `#${invoice.id.slice(-6)}` },
          { label: 'Amount', value: `$${invoice.amount.toLocaleString()}`, highlight: true },
          { label: 'Client', value: client?.email || 'Unknown' },
        ],
      })

      // Bell notification for admin — find all admins
      const admins = await prisma.roles.findMany({
        where: { role: { in: ['admin', 'super_admin'] } },
      })
      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.user_id,
            type: 'invoice_paid',
            title: 'Payment received',
            message: `Invoice #${invoice.id.slice(-6)} paid — $${invoice.amount.toLocaleString()}`,
            link: '/dashboard/hire-approvals',
          },
        })
      }
    } catch (emailErr) {
      // Don't fail the request if email fails
      console.error('Payment confirmation email failed (non-fatal):', emailErr)
    }

    return NextResponse.json({
      success: true,
      invoiceId: updatedInvoice.id,
      applicationId: updatedApplication.id,
    })
  } catch (err: any) {
    console.error('PayPal capture-order error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}