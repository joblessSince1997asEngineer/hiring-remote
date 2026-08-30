import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { company_name, contact_email, role_title, tech_stack, budget_min, budget_max, working_hours } = await request.json()

  try {
    // THE FIX IS HERE: 'client_Requests' (capital R) instead of 'client_requests'
    await prisma.client_Requests.create({
      data: {
        company_name,
        contact_email,
        role_title,
        tech_stack,
        budget_min: parseInt(budget_min),
        budget_max: parseInt(budget_max),
        working_hours,
        status: 'pending_review',
      },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}