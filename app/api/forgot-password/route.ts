import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/email-send'

export async function POST(request: Request) {
  // Rate limit FIRST — before any DB work
  const ip = getClientIp(request)
  const rl = rateLimit(`forgot:${ip}`, 3, 60 * 60 * 1000) // 3 reset requests / hour
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Too many reset requests. Try again in ${Math.ceil(rl.retryAfterSeconds / 60)} min.` },
      { status: 429 }
    )
  }

  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  // Find user
  const user = await prisma.user.findUnique({ where: { email } })

  // Security: Always return same message even if user doesn't exist (prevents email enumeration)
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

  // ⚠️ SANDBOX WORKAROUND: log code so admin can share manually
  // Remove this console.log once Resend domain is verified
  console.log(`[FORGOT PASSWORD] Code for ${email}: ${code}`)

  // Send branded email via shared template
  await sendEmail({
    to: email,
    subject: 'Your password reset code — Remote Hirring',
    title: 'Reset your password',
    greeting: 'Hi there,',
    body: `
      <p>We received a request to reset your password.</p>
      <p style="font-size:28px;font-weight:800;letter-spacing:8px;text-align:center;padding:16px;background-color:#f1f5f9;border-radius:12px;color:#0f172a;margin:24px 0;">
        ${code}
      </p>
      <p>Enter this code on the reset page. It expires in <strong>15 minutes</strong>.</p>
      <p style="color:#64748b;font-size:13px;margin-top:24px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    `,
    footer: 'For your security, never share this code with anyone.',
  })

  // Always return success — even if email fails (sandbox limits).
  // The token is saved and admin sees the code in terminal.
  return NextResponse.json({ message: 'If this email exists, a reset code has been sent.' })
}