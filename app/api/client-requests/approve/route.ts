import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || role.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { requestId } = await request.json()

  try {
    const clientRequest = await prisma.client_Requests.findUnique({ where: { id: requestId } })
    if (!clientRequest) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

    // Create a new Job from the approved request
    await prisma.job.create({
      data: {
        title: clientRequest.role_title,
        company: clientRequest.company_name,
        location: clientRequest.working_hours || 'Worldwide',
        type: 'Full-time',
        description: `Tech Stack: ${clientRequest.tech_stack?.join(', ') || 'Not specified'}\n\nContact: ${clientRequest.contact_email}`,
        salaryMin: clientRequest.budget_min,
        salaryMax: clientRequest.budget_max,
        recruiterId: userId,
      },
    })

    // Mark the request as approved
    await prisma.client_Requests.update({
      where: { id: requestId },
      data: { status: 'approved' },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}