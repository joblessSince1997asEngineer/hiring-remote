import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  // Rate limit: 5 attempts / 15 min (protects 6-digit code from brute-force)
  const ip = getClientIp(request)
  const rl = rateLimit(`reset:${ip}`, 5, 15 * 60 * 1000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(rl.retryAfterSeconds / 60)} min.` },
      { status: 429 }
    )
  }

  const { email, code, newPassword } = await request.json()

  // Validate input
  if (!email || !code || !newPassword) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  // Find user — generic error to prevent enumeration
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
  }

  // Find valid token
  const tokenRecord = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      token: code,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!tokenRecord) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
  }

  // Hash with bcrypt — same as register/login
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Update password + delete ALL tokens for this user (single-use enforcement)
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
  ])

  return NextResponse.json({ success: true })
}