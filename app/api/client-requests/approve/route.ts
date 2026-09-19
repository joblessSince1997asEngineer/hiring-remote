import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || !['admin', 'super_admin'].includes(role.role)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { requestId } = await request.json()

  try {
    const clientRequest = await prisma.client_Requests.findUnique({ where: { id: requestId } })
    if (!clientRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    if (clientRequest.status === 'approved') {
      return NextResponse.json({ error: 'Request already approved' }, { status: 400 })
    }

    // Build a clean description combining the request's details
    const descriptionParts: string[] = []
    if (clientRequest.requirements) {
      descriptionParts.push(clientRequest.requirements)
    }
    if (clientRequest.tech_stack?.length) {
      descriptionParts.push(`Required skills: ${clientRequest.tech_stack.join(', ')}`)
    }
    if (clientRequest.working_hours) {
      descriptionParts.push(`Working hours: ${clientRequest.working_hours}`)
    }
    const description = descriptionParts.join('\n\n') || 'No additional details provided.'

    // Create the Job from the approved request
    const job = await prisma.job.create({
      data: {
        title: clientRequest.role_title,
        company: clientRequest.company_name,
        location: clientRequest.location || 'Remote',
        type: 'Full-time',
        description,

        // Budget / compensation
        salaryMin: clientRequest.budget_min || 0,
        salaryMax: clientRequest.budget_max || 0,
        currency: clientRequest.currency || 'USD',
        salaryPeriod: clientRequest.budgetPeriod || 'month',

        // New structured fields
        seniority: clientRequest.seniority || null,
        remoteType: clientRequest.remoteType || null,
        skills: clientRequest.tech_stack || [],
        requirements: clientRequest.requirements || null,

        // Ownership
        recruiterId: userId,
        status: 'published',
      },
    })

    // Mark request as approved
    await prisma.client_Requests.update({
      where: { id: requestId },
      data: { status: 'approved' },
    })

    // Notify admins (optional — you might want to remove this since admin did the action)
    // Skipping this since admin is the one who clicked approve.

    return NextResponse.json({ success: true, jobId: job.id })
  } catch (error: any) {
    console.error('Approve request error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}