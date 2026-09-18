import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const cookieStore = await cookies()
  const userId = await getUserId()

  if (!userId) {
    return NextResponse.json({ role: null })
  }

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })

  if (role && role.role === 'suspended') {
    cookieStore.delete('userId')
    return NextResponse.json({ role: null })
  }

  if (role && (role.role === 'admin' || role.role === 'super_admin' || role.role === 'recruiter')) {
    return NextResponse.json({ role: role.role })
  }

  // For all other logged-in users (candidates), show the 'user' role
  return NextResponse.json({ role: 'user' })
}