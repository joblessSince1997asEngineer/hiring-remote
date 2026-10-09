import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signSession } from '@/lib/session'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    // 1. Rate limit: 3 signups per IP per hour
    const ip = getClientIp(request)
    const rl = await rateLimit(`register:${ip}`, 3, 60 * 60 * 1000)
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many signups from your network. Try again in ${Math.ceil(rl.retryAfterSeconds / 60)} min.` },
        { status: 429 }
      )
    }

    // 2. Parse body
    const body = await request.json()
    const { email, password, role, website_url } = body

    // 3. Honeypot — bots only. Silent success so the bot doesn't know it failed.
    if (website_url) {
      return NextResponse.json({ success: true })
    }

    // 4. Field validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // 5. Block free email providers for recruiter accounts
    if (role === 'recruiter') {
      const freeDomains = [
        'gmail.com', 'yahoo.com', 'yahoo.co.uk', 'outlook.com', 'hotmail.com',
        'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com',
        'protonmail.com', 'proton.me', 'mail.com', 'gmx.com', 'gmx.net',
        'yandex.com', 'yandex.ru', 'qq.com', '163.com', '126.com', 'rediffmail.com',
        'zoho.com', 'tutanota.com', 'fastmail.com',
      ]
      const domain = String(email).split('@')[1]?.toLowerCase()
      if (domain && freeDomains.includes(domain)) {
        return NextResponse.json(
          { error: 'Please use your work email. Personal email addresses (Gmail, Yahoo, etc.) are not accepted for company accounts.' },
          { status: 400 }
        )
      }
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // 6. Check duplicate
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    // 7. Create user
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'candidate',
      },
    })

    await prisma.roles.create({
      data: {
        user_id: user.id,
        role: role === 'recruiter' ? 'recruiter' : 'candidate',
      },
    })

    // 8. Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('userId', signSession(user.id), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}