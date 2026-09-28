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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const body = await request.json()
    const { tier, status, expiresAt, renewalReminderSentAt } = body as {
      tier?: string
      status?: string
      expiresAt?: string
      renewalReminderSentAt?: string | null
    }

    const data: any = {}
    if (tier !== undefined) {
      if (!['starter', 'growth', 'enterprise'].includes(tier)) {
        return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
      }
      data.tier = tier
    }
    if (status !== undefined) {
      if (!['active', 'expired', 'cancelled'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      data.status = status
    }
    if (expiresAt !== undefined) {
      const d = new Date(expiresAt)
      if (isNaN(d.getTime())) {
        return NextResponse.json({ error: 'Invalid expiresAt' }, { status: 400 })
      }
      data.expiresAt = d
    }
    if (renewalReminderSentAt !== undefined) {
      data.renewalReminderSentAt = renewalReminderSentAt
        ? new Date(renewalReminderSentAt)
        : null
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const sub = await prisma.subscription.update({ where: { id }, data })
    return NextResponse.json({ subscription: sub })
  } catch (err: any) {
    console.error('Subscription update error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    await prisma.subscription.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Subscription delete error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}