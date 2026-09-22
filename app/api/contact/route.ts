import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/email-send'

export async function POST(request: Request) {
  try {
    // Rate limit: 3 messages per IP per hour
    const ip = getClientIp(request)
    const rl = rateLimit(`contact:${ip}`, 3, 60 * 60 * 1000)
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many messages. Try again in ${Math.ceil(rl.retryAfterSeconds / 60)} min.` },
        { status: 429 }
      )
    }

    const { firstName, lastName, email, company, message } = await request.json()

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Save to database — always works
    const saved = await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        company: company || null,
        message,
      },
    })

    // 2. Bell notifications for all admins
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

    // 3. Branded email to admin team
    await sendEmail({
      to: 'hr@remotehirring.com',
      replyTo: email,
      subject: `New Inquiry from ${firstName} ${lastName}${company ? ` at ${company}` : ''}`,
      title: 'New Contact Inquiry',
      greeting: 'Hi team,',
      body: `A new message has been received through the contact form.`,
      infoRows: [
        { label: 'From', value: `${firstName} ${lastName}`, highlight: true },
        { label: 'Email', value: email },
        ...(company ? [{ label: 'Company', value: company }] : []),
      ],
      footer: `<strong>Message:</strong><br />${message.replace(/\n/g, '<br />')}`,
      buttonText: 'View in Dashboard',
      buttonUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://hiring-remote.vercel.app'}/dashboard/contact-messages`,
    })

    return NextResponse.json({ success: true, id: saved.id })
  } catch (error: any) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}