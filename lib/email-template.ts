type EmailTemplateOptions = {
  title: string
  greeting?: string
  body: string
  buttonText?: string
  buttonUrl?: string
  footer?: string
}

/**
 * Builds a branded HTML email body.
 * Uses table-based layout for maximum email client compatibility.
 */
export function emailTemplate({
  title,
  greeting,
  body,
  buttonText,
  buttonUrl,
  footer,
}: EmailTemplateOptions): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Inter',Helvetica,Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Main card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a;padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.5px;">
                    REMOTE<span style="color:#facc15;">HIRRING</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">

              <h1 style="margin:0 0 24px;font-size:24px;font-weight:700;color:#0f172a;line-height:1.3;">
                ${title}
              </h1>

              ${greeting ? `
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
                  ${greeting}
                </p>
              ` : ''}

              <div style="font-size:15px;line-height:1.6;color:#334155;margin-bottom:${buttonText ? '32px' : '0'};">
                ${body}
              </div>

              ${buttonText && buttonUrl ? `
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
                  <tr>
                    <td style="background-color:#0f172a;border-radius:9999px;">
                      <a href="${buttonUrl}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                        ${buttonText}
                      </a>
                    </td>
                  </tr>
                </table>
              ` : ''}

              ${footer ? `
                <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;font-size:13px;line-height:1.5;color:#64748b;">
                  ${footer}
                </div>
              ` : ''}

            </td>
          </tr>

          <!-- Footer bar -->
          <tr>
            <td style="background-color:#f1f5f9;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#64748b;font-style:italic;">
                Great recruitment starts with a conversation
              </p>
              <p style="margin:0;font-size:11px;color:#94a3b8;">
                &copy; ${new Date().getFullYear()} Remote Hirring. All rights reserved.
              </p>
              <p style="margin:12px 0 0;font-size:11px;">
                <a href="https://remotehirring.com" style="color:#64748b;text-decoration:none;margin:0 8px;">Website</a>
                <a href="https://www.linkedin.com/company/remote-hirring" style="color:#64748b;text-decoration:none;margin:0 8px;">LinkedIn</a>
                <a href="https://twitter.com/remotehirring" style="color:#64748b;text-decoration:none;margin:0 8px;">Twitter</a>
              </p>
            </td>
          </tr>

        </table>

        <!-- Recipient note -->
        <p style="margin:24px auto 0;max-width:600px;font-size:11px;color:#94a3b8;text-align:center;line-height:1.5;">
          You received this email because you registered on Remote Hirring.<br />
          If this wasn't you, please ignore it or contact hr@remotehirring.com.
        </p>

      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}