import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const userId = await getUserId()
  if (!userId) return null
  const row = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!row) return null
  if (row.role !== 'admin' && row.role !== 'super_admin') return null
  return userId
}

// GET — list questions for a job
export async function GET(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })

  const questions = await prisma.screeningQuestion.findMany({
    where: { jobId },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json({ questions })
}

// PUT — full replace of questions for a job
export async function PUT(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const { jobId, questions } = await request.json() as {
      jobId?: string
      questions?: Array<{ id?: string; question: string; timeLimit: number }>
    }

    if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })
    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: 'questions must be an array' }, { status: 400 })
    }
    if (questions.length > 10) {
      return NextResponse.json({ error: 'Max 10 questions per job' }, { status: 400 })
    }

    // Validate each question
    for (const q of questions) {
      if (!q.question?.trim()) {
        return NextResponse.json({ error: 'Question text required' }, { status: 400 })
      }
      if (typeof q.timeLimit !== 'number' || q.timeLimit < 15 || q.timeLimit > 300) {
        return NextResponse.json(
          { error: 'Time limit must be 15–300 seconds' },
          { status: 400 }
        )
      }
    }

    // Block editing if any candidate has already responded
    const existingQuestions = await prisma.screeningQuestion.findMany({
      where: { jobId },
      select: { id: true },
    })
    const existingIds = existingQuestions.map(q => q.id)

    if (existingIds.length) {
      const responseCount = await prisma.screeningResponse.count({
        where: { questionId: { in: existingIds } },
      })
      if (responseCount > 0) {
        return NextResponse.json(
          {
            error:
              'Cannot edit questions — candidates have already submitted responses for this job.',
          },
          { status: 409 }
        )
      }
    }

    // Compute which existing questions survive
    const keepIds = questions
      .map(q => q.id)
      .filter((x): x is string => !!x && existingIds.includes(x))

    // Full replace in a transaction
    await prisma.$transaction([
      // Delete questions that aren't in the new list
      prisma.screeningQuestion.deleteMany({
        where: {
          jobId,
          id: { notIn: keepIds.length ? keepIds : ['__none__'] },
        },
      }),
      // Upsert each incoming question with fresh order
      ...questions.map((q, index) =>
        q.id && existingIds.includes(q.id)
          ? prisma.screeningQuestion.update({
              where: { id: q.id },
              data: {
                question: q.question.trim(),
                timeLimit: q.timeLimit,
                order: index,
              },
            })
          : prisma.screeningQuestion.create({
              data: {
                jobId,
                question: q.question.trim(),
                timeLimit: q.timeLimit,
                order: index,
              },
            })
      ),
    ])

    const finalList = await prisma.screeningQuestion.findMany({
      where: { jobId },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ questions: finalList })
  } catch (err: any) {
    console.error('Questions save error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}