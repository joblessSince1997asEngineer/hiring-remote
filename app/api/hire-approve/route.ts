import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const TIER_DISCOUNTS: Record<string, number> = {
  starter: 50,
  growth: 25,
  enterprise: 15,
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify admin
    const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
    if (!roleRow || roleRow.role !== 'admin') {
      return NextResponse.json({ error: 'Only admin can approve hires' }, { status: 403 })
    }

    const body = await request.json()
    const { applicationId, planType, baseAmount } = body

    if (!applicationId || !planType || !baseAmount) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (!['percentage', 'flat'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    const amount = parseInt(baseAmount)
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Load application + verify status
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })
    if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    if (application.status !== 'hire_pending') {
      return NextResponse.json({ error: 'Application is not pending hire approval' }, { status: 400 })
    }

    // Load job to find the client (job owner)
    const job = await prisma.job.findUnique({
      where: { id: application.jobId },
    })
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    const clientId = job.recruiterId
    if (!clientId) {
      return NextResponse.json({ error: 'Job has no client assigned' }, { status: 400 })
    }

    // No duplicate invoice
    const existing = await prisma.invoice.findUnique({ where: { applicationId } })
    if (existing) {
      return NextResponse.json({ error: 'Invoice already exists for this application' }, { status: 400 })
    }

    // Apply client's subscription discount (if active)
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: clientId,
        status: 'active',
        expiresAt: { gt: new Date() },
      },
    })
    const discountPercent = subscription ? (TIER_DISCOUNTS[subscription.tier] || 0) : 0
    const finalAmount = Math.round(amount * (1 - discountPercent / 100))

    // Due date = 15 days from now
    const dueAt = new Date()
    dueAt.setDate(dueAt.getDate() + 15)

    // Create invoice + update application (transaction)
    // Retry loop handles concurrent invoice number collisions
    let invoice: any = null
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      try {
        const year = new Date().getFullYear()
        const lastInvoice = await prisma.invoice.findFirst({
          where: { invoiceNumber: { startsWith: `INV-${year}-` } },
          orderBy: { invoiceNumber: 'desc' },
        })

        let nextNumber = 1
        if (lastInvoice?.invoiceNumber) {
          const match = lastInvoice.invoiceNumber.match(/INV-\d{4}-(\d+)/)
          if (match) nextNumber = parseInt(match[1]) + 1
        }
        const invoiceNumberAttempt = `INV-${year}-${String(nextNumber).padStart(4, '0')}`

        const result = await prisma.$transaction([
          prisma.invoice.create({
            data: {
              invoiceNumber: invoiceNumberAttempt,
              applicationId: application.id,
              jobId: application.jobId,
              clientId,
              planType,
              baseAmount: amount,
              discountPercent,
              amount: finalAmount,
              status: 'pending',
              dueAt,
              remindersSent: [],
            },
          }),
          prisma.application.update({
            where: { id: application.id },
            data: { status: 'awaiting_payment' },
          }),
        ])

        invoice = result[0]
        break
      } catch (err: any) {
        if (err?.code === 'P2002' && attempts < maxAttempts - 1) {
          attempts++
          continue
        }
        throw err
      }
    }

    if (!invoice) {
      return NextResponse.json({ error: 'Could not generate invoice number' }, { status: 500 })
    }

    // Notify the client
    await prisma.notification.create({
      data: {
        userId: clientId,
        type: 'invoice_created',
        title: 'Hire approved — invoice ready',
        message: `Your hire has been approved. Invoice ${invoice.invoiceNumber} for $${finalAmount.toLocaleString()} is due within 15 days.`,
        link: `/invoice?id=${invoice.id}`,
      },
    })

    return NextResponse.json({ success: true, invoiceId: invoice.id, amount: finalAmount })
  } catch (err: any) {
    console.error('Hire approve error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}