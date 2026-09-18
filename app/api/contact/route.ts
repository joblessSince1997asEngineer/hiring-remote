import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, company, message } = await request.json()

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Save to database — this ALWAYS works
    const saved = await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        company: company || null,
        message,
      },
    })

    // 2. Notify all admins via in-app bell
    const admins = await prisma.roles.findMany({
      where: { role: { in: ['admin', 'super_admin'] } },
    })

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.user_id,
          type: 'contact_message',
          title: 'New contact message',
          message: `${firstName} ${lastName}${company ? ` from ${company}` : ''} sent you a message.`,
          link: '/dashboard/contact-messages',
        },
      })
    }

    // 3. Try to email (bonus — will silently fail without a verified domain)
    try {
      await resend.emails.send({
        from: 'Remote Hirring <onboarding@resend.dev>',
        to: ['hr@remotehirring.com'],
        replyTo: email,
        subject: `New Inquiry from ${firstName} ${lastName}${company ? ` at ${company}` : ''}`,
        html: `
          <h2>New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || '—'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr />
          <p style="color: #64748b; font-size: 12px;">
            Also saved to your dashboard. View at /dashboard/contact-messages
          </p>
        `,
      })
    } catch (emailError) {
      // Silent fail — message is already saved, admin will see it
      console.error('Contact email failed (non-fatal):', emailError)
    }

    return NextResponse.json({ success: true, id: saved.id })
  } catch (error: any) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}