import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signSession } from '@/lib/session'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
const rl = rateLimit(`register:${ip}`, 3, 60 * 60 * 1000) // 3 signups / hour
if (!rl.ok) {
  return NextResponse.json(
    { error: `Too many signups from your network. Try again in ${Math.ceil(rl.retryAfterSeconds / 60)} min.` },
    { status: 429 }
  )
}
    const { email, password, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

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