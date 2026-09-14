import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value || 'guest'
  const { jobId, formData } = await request.json()

  try {
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