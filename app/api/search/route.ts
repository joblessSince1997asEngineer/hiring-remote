import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  // 1. Verify the user is an Admin
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Check the Roles table
  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || (role.role !== 'admin' && role.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 3. Extract search and filter params
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('q') || ''
  const maxSalary = searchParams.get('salary') || ''

  // 4. Build the query
  const whereClause: any = {}
  if (search) {
    whereClause.OR = [
      { primary_skill: { contains: search, mode: 'insensitive' } },
      { full_name: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (maxSalary) {
    whereClause.expected_salary = { lte: parseInt(maxSalary) }
  }

  // 5. Fetch candidates (Excluding sensitive data like email/phone for now)
  const candidates = await prisma.profiles.findMany({
    where: whereClause,
    select: {
      id: true,
      full_name: true,
      primary_skill: true,
      years_exp: true,
      expected_salary: true,
      timezone: true,
      cv_url: true,
    },
  })

  return NextResponse.json({ candidates })
}