import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get all jobs assigned to this recruiter/user
  const jobs = await prisma.job.findMany({
    where: { recruiterId: userId },
    include: {
      assignments: {
        include: {
          // US-CL002 SECURITY: We ONLY select fields needed. NO emails, NO phones, NO last names.
          candidate: {
            select: {
              id: true,
              full_name: true,
              primary_skill: true,
              years_exp: true,
              expected_salary: true,
              timezone: true,
            }
          }
        }
      }
    }
  })

  return NextResponse.json({ jobs })
}