import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
  const role = roleRow?.role
  const isAdmin = role === 'admin' || role === 'super_admin'
  const isClient = role === 'recruiter'

  if (!isAdmin && !isClient) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || searchParams.get('search') || '').trim()

  if (!q) {
    return NextResponse.json({ candidates: [], jobs: [], applications: [] })
  }

  const lower = q.toLowerCase()

  // ─── Scope for client: their jobs only ───
  let scopedJobIds: string[] | null = null
  if (isClient) {
    const myJobs = await prisma.job.findMany({
      where: { recruiterId: userId },
      select: { id: true },
    })
    scopedJobIds = myJobs.map(j => j.id)
  }

  // ─── 1. JOBS ───
  const jobWhere: any = {
    OR: [
      { title: { contains: q, mode: 'insensitive' } },
      { company: { contains: q, mode: 'insensitive' } },
      { location: { contains: q, mode: 'insensitive' } },
    ],
  }
  if (scopedJobIds) jobWhere.id = { in: scopedJobIds }

  const jobs = await prisma.job.findMany({
    where: jobWhere,
    select: {
      id: true,
      title: true,
      company: true,
      location: true,
      type: true,
      status: true,
    },
    take: 30,
  })

  // ─── 2. CANDIDATES ───
  // Admin: all candidates matching profile
  // Client: only candidates who applied to their jobs
  let candidateIdScope: string[] | null = null
  if (isClient && scopedJobIds) {
    const apps = await prisma.application.findMany({
      where: { jobId: { in: scopedJobIds } },
      select: { userId: true },
      distinct: ['userId'],
    })
    candidateIdScope = apps.map(a => a.userId)
  }

  const profileWhere: any = {
    OR: [
      { fullName: { contains: q, mode: 'insensitive' } },
      { primarySkill: { contains: q, mode: 'insensitive' } },
    ],
  }
  if (candidateIdScope) profileWhere.userId = { in: candidateIdScope }

  const profiles = await prisma.candidateProfile.findMany({
    where: profileWhere,
    take: 30,
  })

  // Also check application formData for names (fallback)
  const appFormWhere: any = {
    formData: { not: undefined },
  }
  if (scopedJobIds) appFormWhere.jobId = { in: scopedJobIds }

  const appsForNames = await prisma.application.findMany({
    where: appFormWhere,
    select: { userId: true, formData: true },
    distinct: ['userId'],
    take: 200,
  })

  const formDataMatches = appsForNames
    .filter(a => {
      const fd: any = a.formData
      return fd?.fullName?.toLowerCase().includes(lower)
    })
    .filter(a => !profiles.find(p => p.userId === a.userId))

  // Fetch user emails for formData matches
  const formUserIds = formDataMatches.map(a => a.userId)
  const formUsers = formUserIds.length
    ? await prisma.user.findMany({
        where: { id: { in: formUserIds } },
        select: { id: true, email: true },
      })
    : []

  const candidates = [
    ...profiles.map(p => ({
      id: p.userId,
      fullName: p.fullName || 'Unnamed candidate',
      primarySkill: p.primarySkill,
      yearsExp: p.yearsExp,
      expectedSalary: p.expectedSalary,
    })),
    ...formDataMatches.map(a => {
      const fd: any = a.formData
      const u = formUsers.find(x => x.id === a.userId)
      return {
        id: a.userId,
        fullName: fd?.fullName || u?.email?.split('@')[0] || 'Unknown',
        primarySkill: null,
        yearsExp: null,
        expectedSalary: null,
      }
    }),
  ].slice(0, 30)

  // ─── 3. APPLICATIONS ───
  const appWhere: any = {
    OR: [
      { formData: { path: ['fullName'], string_contains: q } },
    ],
  }
  if (scopedJobIds) appWhere.jobId = { in: scopedJobIds }

  // Simpler: fetch recent apps and filter in JS (JSON search is unreliable)
  const appCandidates = await prisma.application.findMany({
    where: scopedJobIds ? { jobId: { in: scopedJobIds } } : {},
    include: { job: { select: { title: true } } },
    orderBy: { appliedAt: 'desc' },
    take: 200,
  })

  const matchedApps = appCandidates
    .filter(a => {
      const fd: any = a.formData
      const nameMatch = fd?.fullName?.toLowerCase().includes(lower)
      const jobMatch = a.job?.title?.toLowerCase().includes(lower)
      const statusMatch = a.status?.toLowerCase().includes(lower)
      return nameMatch || jobMatch || statusMatch
    })
    .slice(0, 20)
    .map(a => {
      const fd: any = a.formData
      return {
        id: a.id,
        candidateName: fd?.fullName || 'Unknown',
        jobTitle: a.job?.title || 'Unknown Job',
        status: a.status,
        appliedAt: a.appliedAt,
      }
    })

  return NextResponse.json({
    candidates,
    jobs,
    applications: matchedApps,
  })
}