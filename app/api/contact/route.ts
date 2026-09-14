import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, company, message } = await request.json()

    await resend.emails.send({
      from: 'Remote Hirring <onboarding@resend.dev>',
      to: ['hello@hiringremote.com'], // Replace with your real email
      subject: `New Inquiry from ${firstName} ${lastName} at ${company}`,
      html: `
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}