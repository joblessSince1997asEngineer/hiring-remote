import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value

  if (!userId) {
    return NextResponse.json({ role: null })
  }

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })

  // If the role is suspended, delete the cookie immediately
  if (role && role.role === 'suspended') {
    cookieStore.delete('userId')
    return NextResponse.json({ role: null })
  }

  if (role && (role.role === 'admin' || role.role === 'super_admin' || role.role === 'recruiter')) {
    return NextResponse.json({ role: role.role })
  }

  return NextResponse.json({ role: null })
}