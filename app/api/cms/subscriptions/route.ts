import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const userId = await getUserId()
  if (!userId) return null
  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!roleRow) return null
  if (roleRow.role !== 'admin' && roleRow.role !== 'super_admin') return null
  return userId
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const subs = await prisma.subscription.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ subscriptions: subs })
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { userId, tier, durationDays } = body as {
      userId?: string
      tier?: string
      durationDays?: number
    }

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
    if (!['starter', 'growth', 'enterprise'].includes(tier || '')) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const existing = await prisma.subscription.findUnique({ where: { userId } })
    if (existing) {
      return NextResponse.json(
        { error: 'Client already has a subscription' },
        { status: 409 }
      )
    }

    const days = Number(durationDays) > 0 ? Number(durationDays) : 365
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)

    const sub = await prisma.subscription.create({
      data: {
        userId,
        tier: tier!,
        status: 'active',
        expiresAt,
        firstPaymentAmount: 5000,
        renewalAmount: 4000,
      },
    })

    return NextResponse.json({ subscription: sub })
  } catch (err: any) {
    console.error('Subscription create error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}