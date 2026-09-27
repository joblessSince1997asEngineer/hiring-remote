import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email-send'

export async function GET(request: Request) {
  try {
    // Auth check (bypass in dev)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    const isDev = process.env.NODE_ENV === 'development'

    if (!isDev && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()

    // Find invoices that are past due and still pending
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: 'pending',
        dueAt: { lt: now },
      },
      include: {
        application: {
          include: { job: true },
        },
      },
    })

    const results: Array<{
      invoiceId: string
      applicationId: string
      cancelled: boolean
      reason: string
    }> = []

    for (const invoice of overdueInvoices) {
      try {
        const jobTitle = invoice.application?.job?.title || 'the role'
        const invoiceNum = invoice.invoiceNumber
        const amount = invoice.amount.toLocaleString()

        // Update both in a transaction
        await prisma.$transaction([
          prisma.invoice.update({
            where: { id: invoice.id },
            data: {
              status: 'cancelled',
              terminatedAt: now,
            },
          }),
          prisma.application.update({
            where: { id: invoice.applicationId },
            data: { status: 'hire_cancelled' },
          }),
        ])

        // Fetch client + candidate for notifications
        const client = await prisma.user.findUnique({ where: { id: invoice.clientId } })
        const candidate = invoice.application?.userId
          ? await prisma.user.findUnique({ where: { id: invoice.application.userId } })
          : null

        // Bell notifications
        const admins = await prisma.roles.findMany({ where: { role: 'admin' } })

        // Notify admins
        for (const admin of admins) {
          await prisma.notification.create({
            data: {
              userId: admin.user_id,
              type: 'invoice_cancelled',
              title: 'Hire auto-cancelled — payment not received',
              message: `Invoice #${invoiceNum} for $${amount} was unpaid. Hire for "${jobTitle}" has been cancelled.`,
              link: '/dashboard/hire-approvals',
            },
          })
        }

        // Notify client
        if (client) {
          await prisma.notification.create({
            data: {
              userId: client.id,
              type: 'invoice_cancelled',
              title: 'Hire cancelled — payment overdue',
              message: `Invoice #${invoiceNum} was unpaid after 15 days. The hire for "${jobTitle}" has been cancelled.`,
              link: '/dashboard/applications',
            },
          })
        }

        // Notify candidate
        if (candidate) {
          await prisma.notification.create({
            data: {
              userId: candidate.id,
              type: 'hire_cancelled',
              title: 'Position no longer available',
              message: `The position for "${jobTitle}" has been cancelled. We'll keep you in mind for future opportunities.`,
              link: '/jobs',
            },
          })
        }

        // Emails
        try {
          // Email client
          if (client?.email) {
            await sendEmail({
              to: client.email,
              subject: `Hire cancelled — Invoice #${invoiceNum} unpaid`,
              title: 'Hire Cancelled',
              greeting: 'Hi,',
              body: `
                <p>Your invoice for the hire of <strong>${jobTitle}</strong> was not paid within the 15-day window.</p>
                <p>As a result, the hire has been automatically cancelled.</p>
                <p style="color:#64748b;font-size:13px;">
                  If this was a mistake or you'd like to discuss payment arrangements, please contact us at hr@remotehirring.com.
                </p>
              `,
              infoRows: [
                { label: 'Invoice #', value: invoiceNum },
                { label: 'Amount', value: `$${amount}` },
                { label: 'Status', value: 'Cancelled', highlight: true },
              ],
            })
          }

          // Email admin
          await sendEmail({
            to: 'hr@remotehirring.com',
            subject: `Hire auto-cancelled — Invoice #${invoiceNum}`,
            title: 'Hire Auto-Cancelled',
            greeting: 'Hi team,',
            body: `An unpaid invoice has been auto-cancelled after the 15-day deadline.`,
            infoRows: [
              { label: 'Invoice #', value: invoiceNum },
              { label: 'Amount', value: `$${amount}`, highlight: true },
              { label: 'Client', value: client?.email || 'Unknown' },
              { label: 'Job', value: jobTitle },
            ],
          })
        } catch (emailErr) {
          console.error('Auto-cancel email failed (non-fatal):', emailErr)
        }

        results.push({
          invoiceId: invoice.id,
          applicationId: invoice.applicationId,
          cancelled: true,
          reason: 'auto-cancelled',
        })
      } catch (err: any) {
        console.error(`Failed to cancel invoice ${invoice.id}:`, err)
        results.push({
          invoiceId: invoice.id,
          applicationId: invoice.applicationId,
          cancelled: false,
          reason: err.message || 'error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      checked: overdueInvoices.length,
      cancelled: results.filter(r => r.cancelled).length,
      results,
    })
  } catch (err: any) {
    console.error('Auto-cancel cron error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}