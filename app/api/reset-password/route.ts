import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { email, code, newPassword } = await request.json()

  // Find user
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Find valid token
  const tokenRecord = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      token: code,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!tokenRecord) return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: Buffer.from(newPassword).toString('base64') },
  })

  // Delete all used tokens
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

  return NextResponse.json({ success: true })
}