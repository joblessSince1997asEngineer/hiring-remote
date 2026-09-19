import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Rate limit: 3 requests per IP per hour
    const ip = getClientIp(request)
    const rl = rateLimit(`client-request:${ip}`, 3, 60 * 60 * 1000)
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${Math.ceil(rl.retryAfterSeconds / 60)} min.` },
        { status: 429 }
      )
    }

    const body = await request.json()

    const {
      company_name,
      contact_email,
      role_title,
      tech_stack,
      budget_min,
      budget_max,
      working_hours,
      // New fields
      contactName,
      companyWebsite,
      companySize,
      seniority,
      remoteType,
      location,
      currency,
      budgetPeriod,
      urgency,
      requirements,
    } = body

    // Validation
    if (!company_name || !contact_email || !role_title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save to database
    const saved = await prisma.client_Requests.create({
      data: {
        company_name,
        contact_email,
        role_title,
        tech_stack: Array.isArray(tech_stack) ? tech_stack : [],
        budget_min: budget_min ? parseInt(budget_min) : null,
        budget_max: budget_max ? parseInt(budget_max) : null,
        working_hours: working_hours || null,
        status: 'pending_review',
        // New fields
        contactName: contactName || null,
        companyWebsite: companyWebsite || null,
        companySize: companySize || null,
        seniority: seniority || null,
        remoteType: remoteType || null,
        location: location || null,
        currency: currency || 'USD',
        budgetPeriod: budgetPeriod || 'month',
        urgency: urgency || null,
        requirements: requirements || null,
      },
    })

    // Notify all admins via in-app bell
    const admins = await prisma.roles.findMany({
      where: { role: { in: ['admin', 'super_admin'] } },
    })

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.user_id,
          type: 'client_request',
          title: 'New hiring request',
          message: `${company_name} requested a ${role_title} role.`,
          link: '/dashboard/client-requests',
        },
      })
    }

    // Try to send email notification (bonus — silent fail if domain not verified)
    try {
      await resend.emails.send({
        from: 'Remote Hirring <onboarding@resend.dev>',
        to: ['hr@remotehirring.com'],
        subject: `New Hiring Request: ${role_title} at ${company_name}`,
        html: `
          <h2>New Hiring Request</h2>
          <p><strong>Company:</strong> ${company_name} ${companySize ? `(${companySize})` : ''}</p>
          ${companyWebsite ? `<p><strong>Website:</strong> ${companyWebsite}</p>` : ''}
          <p><strong>Contact:</strong> ${contactName || ''} — ${contact_email}</p>

          <h3>Role</h3>
          <p><strong>Title:</strong> ${role_title}</p>
          ${seniority ? `<p><strong>Seniority:</strong> ${seniority}</p>` : ''}
          ${remoteType ? `<p><strong>Work Mode:</strong> ${remoteType}</p>` : ''}
          ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
          ${tech_stack?.length ? `<p><strong>Skills:</strong> ${tech_stack.join(', ')}</p>` : ''}

          <h3>Budget</h3>
          <p><strong>Range:</strong> ${currency} ${budget_min}–${budget_max} / ${budgetPeriod}</p>
          ${urgency ? `<p><strong>Urgency:</strong> ${urgency}</p>` : ''}
          ${working_hours ? `<p><strong>Hours:</strong> ${working_hours}</p>` : ''}
          ${requirements ? `<p><strong>Extra:</strong></p><p>${requirements}</p>` : ''}

          <hr />
          <p style="color: #64748b; font-size: 12px;">
            Also saved to your dashboard. View at /dashboard/client-requests
          </p>
        `,
      })
    } catch (emailError) {
      // Silent fail — request is already saved, admin will see it in the dashboard
      console.error('Client request email failed (non-fatal):', emailError)
    }

    return NextResponse.json({ success: true, id: saved.id })
  } catch (error: any) {
    console.error('Client request error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}