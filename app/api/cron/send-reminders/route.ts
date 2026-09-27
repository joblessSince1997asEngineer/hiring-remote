import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email-send'

export async function GET(request: Request) {
  try {
    // Auth check
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    const isDev = process.env.NODE_ENV === 'development'

    if (!isDev && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()

    // Check if today is Monday (1) or Thursday (4)
    const dayOfWeek = now.getUTCDay()
    const isReminderDay = dayOfWeek === 1 || dayOfWeek === 4

    // Allow ?force=1 for testing
    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === '1'

    if (!isReminderDay && !force) {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'Not a reminder day (only Monday & Thursday)',
        today: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      })
    }

    const todayKey = now.toISOString().split('T')[0] // "2026-09-29"

    const pendingInvoices = await prisma.invoice.findMany({
      where: { status: 'pending' },
      include: {
        application: {
          include: { job: true },
        },
      },
    })

    const results: Array<{
      invoiceId: string
      daysLeft: number
      sent: boolean
      reason: string
    }> = []

    for (const invoice of pendingInvoices) {
      const sentDates = (invoice.remindersSent as string[]) || []

      // Skip if already sent today
      if (sentDates.includes(todayKey)) {
        results.push({
          invoiceId: invoice.id,
          daysLeft: 0,
          sent: false,
          reason: 'already sent today',
        })
        continue
      }

      const client = await prisma.user.findUnique({ where: { id: invoice.clientId } })
      if (!client?.email) {
        results.push({
          invoiceId: invoice.id,
          daysLeft: 0,
          sent: false,
          reason: 'no client email',
        })
        continue
      }

      const dueAt = new Date(invoice.dueAt)
      const daysLeft = Math.ceil((dueAt.getTime() - now.getTime()) / 86400000)

      // Skip if invoice is past due (auto-cancel cron handles that)
      if (daysLeft < 0) {
        results.push({
          invoiceId: invoice.id,
          daysLeft,
          sent: false,
          reason: 'past due — awaiting auto-cancel',
        })
        continue
      }

      const jobTitle = invoice.application?.job?.title || 'your recent hire'
      const invoiceNum = invoice.id.slice(-8).toUpperCase()
      const amount = invoice.amount.toLocaleString()

      // Severity based on days left
      const isFinal = daysLeft <= 3
      const isUrgent = daysLeft <= 7

      const severityLabel = isFinal
        ? 'Final Notice'
        : isUrgent
          ? 'Urgent Reminder'
          : 'Payment Reminder'

      try {
        await sendEmail({
          to: client.email,
          subject: `${severityLabel}: Invoice #${invoiceNum} due in ${daysLeft} days`,
          title: isFinal
            ? 'Final Notice — Payment Overdue Soon'
            : isUrgent
              ? 'Urgent Reminder — Payment Due Soon'
              : 'Payment Reminder',
          greeting: 'Hi,',
          body: `
            <p>This is a reminder that your invoice for the hire of <strong>${jobTitle}</strong> is due in <strong>${daysLeft} day${daysLeft === 1 ? '' : 's'}</strong>.</p>
            ${isFinal
              ? '<p style="color:#dc2626;font-weight:600;">After the deadline, this hire will be cancelled automatically.</p>'
              : isUrgent
                ? '<p style="color:#d97706;font-weight:500;">Please make payment soon to avoid cancellation.</p>'
                : ''
            }
          `,
          infoRows: [
            { label: 'Invoice #', value: invoiceNum },
            { label: 'Amount Due', value: `$${amount}`, highlight: true },
            { label: 'Due By', value: dueAt.toLocaleDateString(), highlight: isFinal },
            { label: 'Days Left', value: `${daysLeft}` },
          ],
          buttonText: 'Pay Now',
          buttonUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://hiring-remote.vercel.app'}/invoice?id=${invoice.id}`,
        })

        // Track this date
        const newSent = [...sentDates, todayKey]
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { remindersSent: newSent },
        })

        // Bell notification
        await prisma.notification.create({
          data: {
            userId: client.id,
            type: 'invoice_warning',
            title: `${severityLabel}: Payment due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
            message: `Invoice #${invoiceNum} for $${amount} is due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}.`,
            link: `/invoice?id=${invoice.id}`,
          },
        })

        results.push({ invoiceId: invoice.id, daysLeft, sent: true, reason: 'sent' })
      } catch (err: any) {
        console.error(`Failed reminder for ${invoice.id}:`, err)
        results.push({
          invoiceId: invoice.id,
          daysLeft,
          sent: false,
          reason: err.message || 'send failed',
        })
      }
    }

    return NextResponse.json({
      success: true,
      checked: pendingInvoices.length,
      sentToday: results.filter(r => r.sent).length,
      results,
    })
  } catch (err: any) {
    console.error('Send reminders error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}