import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { company_name, contact_email, role_title, tech_stack, budget_min, budget_max, working_hours } = await request.json()

  try {
    // 1. Save to database
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

    // 2. Send Email Notification to Admin Team
    try {
      await resend.emails.send({
        from: 'Remote Hirring <onboarding@resend.dev>', // Use your verified domain later
        to: ['captainbushra179@gmail.com.', 'muahmada1@gmail.com'], // ⚠️ REPLACE with real emails
        subject: `New B2B Lead: ${role_title} at ${company_name}`,
        html: `<p>A new hiring request has arrived.</p>
               <p><strong>Company:</strong> ${company_name}</p>
               <p><strong>Contact:</strong> ${contact_email}</p>
               <p><strong>Role:</strong> ${role_title}</p>
               <p><strong>Budget:</strong> $${budget_min}k - $${budget_max}k</p>
               <p><strong>Working Hours:</strong> ${working_hours}</p>`,
      })
    } catch (emailError) {
      console.error('Email failed to send:', emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}