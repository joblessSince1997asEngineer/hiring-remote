import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

// GET — fetch the current candidate's profile
export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let profile = await prisma.candidateProfile.findUnique({ where: { userId } })

    // Auto-create empty profile on first visit
    if (!profile) {
      profile = await prisma.candidateProfile.create({
        data: { userId },
      })
    }

    return NextResponse.json({ profile })
  } catch (err: any) {
    console.error('Get profile error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

// PUT — update the current candidate's profile
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    // Whitelist fields — never trust arbitrary input
    const allowed = [
      'fullName', 'avatarUrl', 'primarySkill', 'yearsExp', 'expectedSalary',
      'timezone', 'phone', 'city', 'country', 'linkedinUrl', 'portfolioUrl',
      'bio', 'cvUrl',
    ]

    const data: any = {}
    for (const key of allowed) {
      if (key in body) {
        // Convert empty strings to null so we don't store ""
        data[key] = body[key] === '' ? null : body[key]
      }
    }

    // Type coercion for numbers
    if (data.yearsExp !== undefined && data.yearsExp !== null) {
      data.yearsExp = parseInt(data.yearsExp)
      if (isNaN(data.yearsExp)) data.yearsExp = null
    }
    if (data.expectedSalary !== undefined && data.expectedSalary !== null) {
      data.expectedSalary = parseInt(data.expectedSalary)
      if (isNaN(data.expectedSalary)) data.expectedSalary = null
    }

    // Upsert — create if not exists, update if it does
    const profile = await prisma.candidateProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    })

    return NextResponse.json({ success: true, profile })
  } catch (err: any) {
    console.error('Update profile error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}