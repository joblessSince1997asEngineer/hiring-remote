import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — return the current user's saved jobs (full job data)
export async function GET() {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const saved = await prisma.savedJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { job: true },
    })

    // Return just the job records (with savedAt)
    return NextResponse.json({
      jobs: saved.map(s => ({ ...s.job, savedAt: s.createdAt })),
      jobIds: saved.map(s => s.jobId),
    })
  } catch (err: any) {
    console.error('SavedJob GET error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

// POST — toggle save/unsave for a job
export async function POST(request: Request) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { jobId } = await request.json()
    if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })

    const existing = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    })

    if (existing) {
      await prisma.savedJob.delete({ where: { id: existing.id } })
      return NextResponse.json({ saved: false })
    }

    await prisma.savedJob.create({
      data: { userId, jobId },
    })

    return NextResponse.json({ saved: true })
  } catch (err: any) {
    console.error('SavedJob POST error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}