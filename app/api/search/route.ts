import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  // 1. Verify admin
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || (role.role !== 'admin' && role.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Params
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('q') || ''
  const maxSalary = searchParams.get('salary') || ''

  // 3. Query CandidateProfile (the new model)
  const whereClause: any = {}
  if (search) {
    whereClause.OR = [
      { primarySkill: { contains: search, mode: 'insensitive' } },
      { fullName: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (maxSalary) {
    whereClause.expectedSalary = { lte: parseInt(maxSalary) }
  }

  const profiles = await prisma.candidateProfile.findMany({
    where: whereClause,
    select: {
      id: true,
      userId: true,
      fullName: true,
      primarySkill: true,
      yearsExp: true,
      expectedSalary: true,
      timezone: true,
      cvUrl: true,
    },
  })

  // 4. Map to a shape the frontend expects
  const candidates = profiles.map((p) => ({
    id: p.userId,             // ← use userId as identifier
    profileId: p.id,
    full_name: p.fullName,
    primary_skill: p.primarySkill || 'Not Set',
    years_exp: p.yearsExp,
    expected_salary: p.expectedSalary,
    timezone: p.timezone,
    cv_url: p.cvUrl,
  }))

  return NextResponse.json({ candidates })
}