import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createPayPalOrder } from '@/lib/paypal'

export async function POST(request: Request) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { invoiceId } = await request.json()
    if (!invoiceId) {
      return NextResponse.json({ error: 'Missing invoiceId' }, { status: 400 })
    }

    // Load invoice + verify ownership
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Only the client who owns this invoice can pay
    if (invoice.clientId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Already paid or cancelled
    if (invoice.status === 'paid') {
      return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 })
    }
    if (invoice.status === 'cancelled') {
      return NextResponse.json({ error: 'Invoice cancelled' }, { status: 400 })
    }

    // Create PayPal order
    const order = await createPayPalOrder({
      amount: invoice.amount,
      invoiceId: invoice.id,
      currency: invoice.currency || 'USD',
    })

    // Save the PayPal order id on the invoice (for reference)
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { stripeSessionId: order.id }, // reusing field name — stores PayPal order id
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: invoice.amount,
      currency: invoice.currency || 'USD',
    })
  } catch (err: any) {
    console.error('PayPal create-order error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}