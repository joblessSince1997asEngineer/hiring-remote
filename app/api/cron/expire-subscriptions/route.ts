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
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    const isDev = process.env.NODE_ENV === 'development'

    if (!isDev && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()

    const stale = await prisma.subscription.findMany({
      where: {
        status: 'active',
        expiresAt: { lt: now },
      },
    })

    const results: Array<{
      subscriptionId: string
      userId: string
      expired: boolean
      reason: string
    }> = []

    for (const sub of stale) {
      try {
        const client = await prisma.user.findUnique({ where: { id: sub.userId } })
        const tierLabel = TIER_LABELS[sub.tier] ?? sub.tier
        const expiredStr = new Date(sub.expiresAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })

        // Mark expired
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: 'expired' },
        })

        // Bell notification
        await prisma.notification.create({
          data: {
            userId: sub.userId,
            type: 'subscription_expired',
            title: 'Subscription expired',
            message: `Your ${tierLabel} subscription expired on ${expiredStr}. New hires will no longer receive the per-hire discount.`,
            link: '/dashboard',
          },
        })

        // Email
        if (client?.email) {
          await sendEmail({
            to: client.email,
            subject: 'Your Remote Hirring subscription has expired',
            title: 'Subscription Expired',
            greeting: 'Hi,',
            body: `
              <p>Your <strong>${tierLabel}</strong> annual subscription expired on <strong>${expiredStr}</strong>.</p>
              <p>New hire invoices will no longer receive the per-hire discount.</p>
              <p>If you'd like to reactivate, reply to this email or contact us at hr@remotehirring.com.</p>
            `,
            infoRows: [
              { label: 'Tier', value: tierLabel },
              { label: 'Expired On', value: expiredStr, highlight: true },
              { label: 'Status', value: 'Expired' },
            ],
          })
        }

        results.push({
          subscriptionId: sub.id,
          userId: sub.userId,
          expired: true,
          reason: 'expired',
        })
      } catch (err: any) {
        console.error(`Expire failed for ${sub.id}:`, err)
        results.push({
          subscriptionId: sub.id,
          userId: sub.userId,
          expired: false,
          reason: err.message || 'error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      checked: stale.length,
      expired: results.filter(r => r.expired).length,
      results,
    })
  } catch (err: any) {
    console.error('Expire-subscriptions cron error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}