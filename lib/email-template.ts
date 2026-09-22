type InfoRow = {
  label: string
  value: string
  highlight?: boolean
}

type EmailTemplateOptions = {
  title: string
  greeting?: string
  body: string
  buttonText?: string
  buttonUrl?: string
  footer?: string
  infoRows?: InfoRow[]
}

export function emailTemplate({
  title,
  greeting,
  body,
  buttonText,
  buttonUrl,
  footer,
  infoRows,
}: EmailTemplateOptions): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hiring-remote.vercel.app'
  const logoUrl = `${appUrl}/logo.png`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#334155;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.06);">

              <!-- Amber top bar -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#facc15;height:4px;line-height:4px;font-size:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Header: logo + tagline -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:28px 36px 20px 36px;">
                    <img src="${logoUrl}" alt="Remote Hirring" style="height:34px;width:auto;display:block;margin:0 0 8px;" />
                    <div style="font-size:11px;color:#94a3b8;font-style:italic;line-height:1.4;">
                      Great recruitment starts with a conversation
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Body -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:8px 36px 36px 36px;">

                    <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#0f172a;line-height:1.35;letter-spacing:-0.2px;">
                      ${title}
                    </h1>

                    ${greeting ? `
                      <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#334155;">
                        ${greeting}
                      </p>
                    ` : ''}

                    <div style="font-size:15px;line-height:1.65;color:#334155;margin-bottom:${infoRows?.length || buttonText ? '24px' : '0'};">
                      ${body}
                    </div>

                    ${infoRows && infoRows.length > 0 ? `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
                        <tr>
                          <td style="background-color:#f8fafc;border-left:4px solid #facc15;border-radius:6px;padding:18px 22px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                              ${infoRows.map(row => `
                                <tr>
                                  <td style="padding:6px 0;font-size:13px;line-height:1.5;">
                                    <span style="color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px;font-size:11px;font-weight:600;display:block;margin-bottom:3px;">${row.label}</span>
                                    <span style="color:${row.highlight ? '#0f172a' : '#334155'};font-size:${row.highlight ? '18px' : '15px'};font-weight:${row.highlight ? '700' : '500'};">
                                      ${row.value}
                                    </span>
                                  </td>
                                </tr>
                              `).join('')}
                            </table>
                          </td>
                        </tr>
                      </table>
                    ` : ''}

                    ${buttonText && buttonUrl ? `
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 4px;">
                        <tr>
                          <td style="background-color:#0f172a;border-radius:9999px;">
                            <a href="${buttonUrl}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">
                              ${buttonText}
                            </a>
                          </td>
                        </tr>
                      </table>
                    ` : ''}

                    ${footer ? `
                      <div style="margin-top:28px;padding-top:20px;border-top:1px solid #f1f5f9;font-size:13px;line-height:1.6;color:#64748b;">
                        ${footer}
                      </div>
                    ` : ''}

                  </td>
                </tr>
              </table>

              <!-- Bottom bar -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#f8fafc;padding:18px 36px;border-top:1px solid #e2e8f0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:11px;color:#94a3b8;line-height:1.6;">
                          &copy; ${new Date().getFullYear()} Remote Hirring
                        </td>
                        <td style="text-align:right;font-size:11px;white-space:nowrap;">
                          <a href="https://remotehirring.com" style="color:#64748b;text-decoration:none;margin-left:14px;">Website</a>
                          <a href="https://www.linkedin.com/company/remote-hirring" style="color:#64748b;text-decoration:none;margin-left:14px;">LinkedIn</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Outer note -->
          <tr>
            <td style="padding:20px 8px 0 8px;text-align:center;font-size:11px;color:#94a3b8;line-height:1.6;">
              You received this email because you registered on Remote Hirring.<br />
              Need help? Contact <a href="mailto:hr@remotehirring.com" style="color:#64748b;text-decoration:underline;">hr@remotehirring.com</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}