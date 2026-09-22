import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/email-send'

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

    const currentUserId = await getUserId()
    const body = await request.json()

    const {
      company_name,
      contact_email,
      role_title,
      tech_stack,
      budget_min,
      budget_max,
      working_hours,
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
        userId: currentUserId || null,
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

    // Notify the client (bell) that their request was received
    if (currentUserId) {
      await prisma.notification.create({
        data: {
          userId: currentUserId,
          type: 'request_submitted',
          title: 'Request submitted',
          message: `Your request for ${role_title} is under review. We'll be in touch shortly.`,
          link: '/dashboard/my-requests',
        },
      })
    }

    // Send branded email to admin team
    const budgetLine = budget_min && budget_max
      ? `${currency || 'USD'} ${parseInt(budget_min).toLocaleString()}–${parseInt(budget_max).toLocaleString()} / ${budgetPeriod || 'month'}`
      : 'Not specified'

    await sendEmail({
      to: 'hr@remotehirring.com',
      replyTo: contact_email,
      subject: `New Hiring Request — ${role_title} at ${company_name}`,
      title: 'New Hiring Request',
      greeting: 'Hi team,',
      body: `A new hiring request has been submitted through the platform.`,
      infoRows: [
        { label: 'Company', value: company_name, highlight: true },
        ...(companySize ? [{ label: 'Company Size', value: companySize }] : []),
        ...(companyWebsite ? [{ label: 'Website', value: companyWebsite }] : []),
        { label: 'Contact', value: `${contactName || ''} — ${contact_email}`.trim() },
        { label: 'Role', value: role_title },
        ...(seniority ? [{ label: 'Seniority', value: seniority }] : []),
        ...(remoteType ? [{ label: 'Work Mode', value: remoteType }] : []),
        ...(location ? [{ label: 'Location', value: location }] : []),
        ...(tech_stack?.length ? [{ label: 'Skills', value: tech_stack.join(', ') }] : []),
        { label: 'Budget', value: budgetLine, highlight: true },
        ...(urgency ? [{ label: 'Urgency', value: urgency }] : []),
        ...(working_hours ? [{ label: 'Working Hours', value: working_hours }] : []),
      ],
      buttonText: 'Review Request',
      buttonUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://hiring-remote.vercel.app'}/dashboard/client-requests`,
    })

    // Send confirmation email to the client
    await sendEmail({
      to: contact_email,
      subject: `We received your hiring request — ${role_title}`,
      title: 'Hiring Request Received',
      greeting: `Dear ${contactName || company_name},`,
      body: `Thank you for submitting a hiring request for <strong>${role_title}</strong>. Our team is reviewing the details and will be in touch within 24 hours to confirm next steps.`,
      infoRows: [
        { label: 'Role', value: role_title },
        { label: 'Company', value: company_name },
        { label: 'Submitted', value: new Date().toLocaleDateString(), highlight: true },
      ],
      footer: `If you need to make changes or have any questions, simply reply to this email.`,
    })

    return NextResponse.json({ success: true, id: saved.id })
  } catch (error: any) {
    console.error('Client request error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}