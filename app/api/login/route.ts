import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signSession } from '@/lib/session'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    // Rate limit: 5 attempts per IP per 15 minutes
    const ip = getClientIp(request)
    const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${Math.ceil(rl.retryAfterSeconds / 60)} min.` },
        { status: 429 }
      )
    }

    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Support bcrypt hashes AND legacy base64 (auto-upgrade on successful login)
    const isBcrypt =
      user.password.startsWith('$2a$') ||
      user.password.startsWith('$2b$') ||
      user.password.startsWith('$2y$')

    let valid = false
    let needsUpgrade = false

    if (isBcrypt) {
      valid = await bcrypt.compare(password, user.password)
    } else {
      // Legacy base64 — check, then rehash on success
      if (user.password === Buffer.from(password).toString('base64')) {
        valid = true
        needsUpgrade = true
      }
    }

    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Lazy migration: upgrade legacy base64 → bcrypt
    if (needsUpgrade) {
      const hashed = await bcrypt.hash(password, 10)
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
      })
    }

    const cookieStore = await cookies()
    cookieStore.set('userId', signSession(user.id), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}