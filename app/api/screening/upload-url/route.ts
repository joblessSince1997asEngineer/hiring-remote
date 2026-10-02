import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { applicationId, questionId, fileExt } = await request.json()

    if (!applicationId || !questionId) {
      return NextResponse.json({ error: 'Missing applicationId or questionId' }, { status: 400 })
    }
    const ext = String(fileExt || 'webm').replace(/[^a-z0-9]/gi, '').slice(0, 5)

    // Verify the candidate owns this application + screening is active
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { userId: true, screeningStatus: true },
    })
    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    if (app.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (app.screeningStatus !== 'pending') {
      return NextResponse.json(
        { error: 'Screening not active for this application' },
        { status: 400 }
      )
    }

    // Verify the question belongs to this application's job
    const question = await prisma.screeningQuestion.findUnique({
      where: { id: questionId },
      include: { job: { include: { applications: { select: { id: true } } } } },
    })
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }
    const belongsToApp = question.job.applications.some(a => a.id === applicationId)
    if (!belongsToApp) {
      return NextResponse.json({ error: 'Question not for this application' }, { status: 400 })
    }

    // File path: {applicationId}/{questionId}.{ext}
    const filePath = `${applicationId}/${questionId}.${ext}`

    const { data, error } = await supabaseAdmin.storage
      .from('screening-videos')
      .createSignedUploadUrl(filePath, { upsert: true })

    if (error) throw error

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      token: data.token,
      path: filePath,
    })
  } catch (err: any) {
    console.error('screening upload-url error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}