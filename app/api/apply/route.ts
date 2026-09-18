import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userId = (await getUserId()) || 'guest'
  const { jobId, formData } = await request.json()

  try {
    const ip = getClientIp(request)
const rl = rateLimit(`apply:${ip}`, 10, 60 * 60 * 1000) // 10 applications / hour
if (!rl.ok) {
  return NextResponse.json(
    { error: `Too many applications. Please try again in ${Math.ceil(rl.retryAfterSeconds / 60)} min.` },
    { status: 429 }
  )
}
    // 1. Save the full application with ALL form data
    await prisma.application.create({
      data: {
        jobId,
        userId,
        coverLetter: formData.coverLetter || '',
        cv_url: formData.cv_url || null,
        formData: formData, // *** ALL ANSWERS SAVED HERE ***
      },
    })

    // 2. Create or update the candidate's profile
    const existingProfile = await prisma.profiles.findUnique({ where: { id: userId } })
    if (!existingProfile) {
      await prisma.profiles.create({
        data: {
          id: userId,
          full_name: formData.fullName || 'Applied Candidate',
          primary_skill: 'Not Set',
          years_exp: 0,
          expected_salary: 0,
          timezone: 'Not Set',
          cv_url: formData.cv_url || null,
        },
      })
    } else {
      await prisma.profiles.update({
        where: { id: userId },
        data: { cv_url: formData.cv_url || existingProfile.cv_url },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Application error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}