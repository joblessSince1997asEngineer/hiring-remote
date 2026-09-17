import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const TIER_DISCOUNTS: Record<string, number> = {
  starter: 50,
  growth: 25,
  enterprise: 15,
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify admin
    const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
    if (!roleRow || !['admin', 'super_admin'].includes(roleRow.role)) {
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

    // No duplicate invoice
    const existing = await prisma.invoice.findUnique({ where: { applicationId } })
    if (existing) {
      return NextResponse.json({ error: 'Invoice already exists for this application' }, { status: 400 })
    }

    // Apply client's subscription discount (if active)
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: application.userId,
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
    const [invoice] = await prisma.$transaction([
      prisma.invoice.create({
        data: {
          applicationId: application.id,
          jobId: application.jobId,
          clientId: application.userId,
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

    // Notify the client
    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: 'invoice_created',
        title: 'Hire approved — invoice ready',
        message: `Your hire has been approved. Invoice of $${finalAmount.toLocaleString()} is due within 15 days.`,
        link: '/account',
      },
    })

    return NextResponse.json({ success: true, invoiceId: invoice.id, amount: finalAmount })
  } catch (err: any) {
    console.error('Hire approve error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}