import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email-send'

const TIER_LABELS: Record<string, string> = {
  starter: 'Starter',
  growth: 'Growth',
  enterprise: 'Enterprise',
}

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
    const horizon = new Date(now.getTime() + 31 * 86400000) // 31 days out

    // Only active subs expiring within the next 31 days
    const candidates = await prisma.subscription.findMany({
      where: {
        status: 'active',
        expiresAt: { gt: now, lt: horizon },
      },
    })

    const results: Array<{
      subscriptionId: string
      userId: string
      reminder: string | null
      sent: boolean
      reason: string
    }> = []

    for (const sub of candidates) {
      const expiresAt = new Date(sub.expiresAt)
      const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / 86400000)
      const lastSent = sub.renewalReminderSentAt
      const hoursSinceLastSent = lastSent
        ? (now.getTime() - new Date(lastSent).getTime()) / 3600000
        : Infinity

      // Decide which reminder (if any) to fire
      let reminder: 'final' | 'week' | 'month' | null = null
      if (daysLeft <= 1 && hoursSinceLastSent > 12) {
        reminder = 'final'
      } else if (daysLeft <= 7 && hoursSinceLastSent > 48) {
        reminder = 'week'
      } else if (daysLeft <= 30 && !lastSent) {
        reminder = 'month'
      }

      if (!reminder) {
        results.push({
          subscriptionId: sub.id,
          userId: sub.userId,
          reminder: null,
          sent: false,
          reason: 'no reminder due',
        })
        continue
      }

      try {
        const client = await prisma.user.findUnique({ where: { id: sub.userId } })

        const copy = {
          month: {
            subject: 'Your Remote Hirring subscription expires in 30 days',
            title: 'Subscription Renewal',
            heading: '30 days until expiry',
          },
          week: {
            subject: 'Your Remote Hirring subscription expires in 7 days',
            title: 'Subscription Renewal',
            heading: '7 days until expiry',
          },
          final: {
            subject: 'Your Remote Hirring subscription expires tomorrow',
            title: 'Subscription Renewal',
            heading: 'Expires tomorrow',
          },
        }[reminder]

        const tierLabel = TIER_LABELS[sub.tier] ?? sub.tier
        const expiresStr = expiresAt.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
        const renewalAmount = sub.renewalAmount.toLocaleString()

        // Bell notification
        await prisma.notification.create({
          data: {
            userId: sub.userId,
            type: 'subscription_renewal',
            title: copy.title,
            message: `Your ${tierLabel} subscription expires on ${expiresStr}. Renew at $${renewalAmount}/year to keep your discount.`,
            link: '/dashboard',
          },
        })

        // Email
        if (client?.email) {
          await sendEmail({
            to: client.email,
            subject: copy.subject,
            title: copy.title,
            greeting: 'Hi,',
            body: `
              <p><strong>${copy.heading}.</strong></p>
              <p>Your <strong>${tierLabel}</strong> annual subscription expires on <strong>${expiresStr}</strong>.</p>
              <p>Once it expires, per-hire discounts are no longer applied to new invoices.</p>
              <p>To continue receiving your discount, renew before the expiry date.</p>
              <p style="color:#64748b;font-size:13px;">
                Reply to this email or contact us at hr@remotehirring.com to renew.
              </p>
            `,
            infoRows: [
              { label: 'Tier', value: tierLabel },
              { label: 'Expires', value: expiresStr, highlight: true },
              { label: 'Renewal', value: `$${renewalAmount}/year` },
              { label: 'Days Left', value: String(daysLeft) },
            ],
          })
        }

        // Mark reminder sent
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { renewalReminderSentAt: now },
        })

        results.push({
          subscriptionId: sub.id,
          userId: sub.userId,
          reminder,
          sent: true,
          reason: 'sent',
        })
      } catch (err: any) {
        console.error(`Reminder failed for ${sub.id}:`, err)
        results.push({
          subscriptionId: sub.id,
          userId: sub.userId,
          reminder,
          sent: false,
          reason: err.message || 'error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      checked: candidates.length,
      sent: results.filter(r => r.sent).length,
      results,
    })
  } catch (err: any) {
    console.error('Subscription reminder cron error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}