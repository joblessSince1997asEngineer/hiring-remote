import { Resend } from 'resend'
import { emailTemplate } from './email-template'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.EMAIL_FROM || 'Remote Hirring <onboarding@resend.dev>'

type InfoRow = {
  label: string
  value: string
  highlight?: boolean
}

type SendEmailOptions = {
  to: string | string[]
  subject: string
  title: string
  greeting?: string
  body: string
  buttonText?: string
  buttonUrl?: string
  footer?: string
  replyTo?: string
  infoRows?: InfoRow[]
}

export async function sendEmail(opts: SendEmailOptions) {
  try {
    const html = emailTemplate({
      title: opts.title,
      greeting: opts.greeting,
      body: opts.body,
      buttonText: opts.buttonText,
      buttonUrl: opts.buttonUrl,
      footer: opts.footer,
      infoRows: opts.infoRows,
    })

    const result = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    })

    return { success: true, result }
  } catch (err: any) {
    console.error('Email send failed (non-fatal):', err?.message || err)
    return { success: false, error: err?.message }
  }
}