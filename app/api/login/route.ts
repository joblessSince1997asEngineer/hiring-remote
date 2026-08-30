import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // 1. Find the user first
    const user = await prisma.user.findUnique({ where: { email } })
    
    // 2. If user doesn't exist or password is wrong -> error
    if (!user || user.password !== Buffer.from(password).toString('base64')) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // 3. Login successful -> return user ID
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}