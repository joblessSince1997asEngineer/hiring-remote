import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { email } = await request.json()

  // Find user
  const user = await prisma.user.findUnique({ where: { email } })
  
  // Security: Always say "sent" even if user doesn't exist to prevent email enumeration
  if (!user) {
    return NextResponse.json({ message: 'If this email exists, a reset code has been sent.' })
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  // Save token (expires in 15 minutes)
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  })

  // Send email via Resend
  try {
    await resend.emails.send({
      from: 'Remote Hirring <onboarding@resend.dev>', // Update with your verified domain if needed
      to: email,
      subject: 'Reset your password',
      html: `<p>Your password reset code is: <strong>${code}</strong></p><p>This code will expire in 15 minutes.</p>`,
    })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ message: 'If this email exists, a reset code has been sent.' })
}