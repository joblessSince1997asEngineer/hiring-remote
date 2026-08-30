import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')

  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })

  // Find the hired application for this job
  const application = await prisma.application.findFirst({
    where: { jobId, status: 'hired' },
    orderBy: { appliedAt: 'desc' }
  })

  if (!application) return NextResponse.json({ error: 'No hired candidate found' }, { status: 404 })

  // Get job details to show on invoice
  const job = await prisma.job.findUnique({ where: { id: jobId } })

  return NextResponse.json({ application, job })
}